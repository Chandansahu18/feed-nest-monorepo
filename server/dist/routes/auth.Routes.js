"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const handleUserAuth_controller_1 = __importDefault(require("../controllers/auth/handleUserAuth.controller"));
const handleUserEmailVerification_controller_1 = require("../controllers/auth/handleUserEmailVerification.controller");
const router = express_1.default.Router();
router.route("/v1/auth").post(handleUserAuth_controller_1.default);
router.route("/verify").get(handleUserEmailVerification_controller_1.handleUserEmailVerification);
exports.default = router;
