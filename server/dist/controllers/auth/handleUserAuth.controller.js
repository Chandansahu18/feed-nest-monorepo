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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../../generated/prisma");
const hash_1 = require("../../utils/hash");
const authTokens_1 = require("../../utils/authTokens");
const schemaValidate_1 = require("../../utils/schemaValidate");
const email_1 = __importDefault(require("../../utils/email"));
const prisma = new prisma_1.PrismaClient();
// check if environment variables are present or not(undefined) by using ! at the end.
const accessTokenExpiryTime = parseInt((_a = process.env.ACCESS_TOKEN_EXPIRY) !== null && _a !== void 0 ? _a : "");
const refreshTokenExpiryTime = parseInt((_b = process.env.REFRESH_TOKEN_EXPIRY) !== null && _b !== void 0 ? _b : "");
const frontendURL = parseInt((_c = process.env.FRONTEND_URL) !== null && _c !== void 0 ? _c : "");
const handleUserAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const validUserData = schemaValidate_1.validateUserData.safeParse(req.body);
        if (!validUserData.data) {
            const errors = (_a = validUserData.error) === null || _a === void 0 ? void 0 : _a.issues;
            const errorMessage = errors.length === 1 ? errors[0].message : 'missing required fields';
            throw new Error(errorMessage);
        }
        const { email, name, userName, password } = validUserData.data;
        const existingUser = yield prisma.user.findUnique({
            where: { email },
        });
        if (!existingUser) {
            const accessToken = (0, authTokens_1.generateToken)(email, accessTokenExpiryTime);
            const hashedPassword = yield (0, hash_1.generateHash)(password !== null && password !== void 0 ? password : "");
            const refreshToken = (0, authTokens_1.generateToken)(email, refreshTokenExpiryTime);
            const newUser = yield prisma.user.create({
                data: {
                    name,
                    userName,
                    email,
                    hashedPassword
                }
            });
            yield (0, email_1.default)(email, "sign up", "Email verification link for signup", {
                redirectToEmailVerificationPageLink: `${frontendURL}/verify/${accessToken}`,
            });
            res.status(200).json({
                success: true,
                message: "Email has been sent to your mail to verify your email."
            });
        }
        ;
        // const verifyAccessToken = verifyToken(accessToken);
        // const verifyRefreshToken = verifyToken(refreshToken);
        // if (!existingUser) {
        //   const newUser = await prisma.user.create({
        //     data: {
        //       name,
        //       userName,
        //       email,
        //       hashedpassword: password,
        //       accessToken: accessToken ?? '',
        //       refreshToken: refreshToken ?? '',
        //     },
        //   });
        //   res.status(200).json({
        //     success: true,
        //     message: 'User has been registered successfully.',
        //     data: newUser,
        //   });
        //   return;
        // } else {
        //   res.status(200).json({
        //     success: true,
        //     message: 'User already exist.',
        //     data: existingUser,
        //   });
        //   return;
        // }
    }
    catch (error) {
        const errorMessage = error instanceof Error
            ? error.message
            : 'Internal server error, please try again later';
        res.status(500).json({
            success: false,
            message: errorMessage,
        });
    }
});
exports.default = handleUserAuth;
