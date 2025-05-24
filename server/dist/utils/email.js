"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
// Nodemailer setup
const auth = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_EMAIL_PASSWORD,
    },
});
// Path to emails ejs templates
const emailsPath = path_1.default.resolve(__dirname, '..', '..', 'views', 'emails');
const resetPasswordEmailTemplatePath = path_1.default.join(emailsPath, 'resetPasswordEmail.ejs');
const signUpEmailTemplatePath = path_1.default.join(emailsPath, 'signupEmail.ejs');
const signInEmailTemplatePath = path_1.default.join(emailsPath, 'signinEmail.ejs');
const deleteAccountTemplatePath = path_1.default.join(emailsPath, 'deleteAccountEmail.ejs');
const sendMail = (email, type, subject, params) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Render the EJS template
        let html;
        switch (type) {
            case 'reset password':
                html = yield ejs_1.default.renderFile(resetPasswordEmailTemplatePath, {
                    redirectToEmailVerificationPageLink: params.redirectToEmailVerificationPageLink,
                });
                break;
            case 'sign up':
                html = yield ejs_1.default.renderFile(signUpEmailTemplatePath, {
                    redirectToEmailVerificationPageLink: params.redirectToEmailVerificationPageLink,
                });
                break;
            case 'sign in':
                html = yield ejs_1.default.renderFile(signInEmailTemplatePath, {
                    redirectToEmailVerificationPageLink: params.redirectToEmailVerificationPageLink,
                });
                break;
            case 'delete account':
                html = yield ejs_1.default.renderFile(deleteAccountTemplatePath);
                break;
            default:
                throw new Error(`Invalid email type: ${type}`);
        }
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject,
            html,
        };
        yield auth.sendMail(mailOptions);
    }
    catch (error) {
        const errorMessage = error instanceof Error
            ? error.message
            : 'Error sending mail';
        throw new Error(errorMessage);
    }
});
exports.default = sendMail;
