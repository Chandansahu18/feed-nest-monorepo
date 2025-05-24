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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUserEmailVerification = void 0;
const prisma_1 = require("../../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
const handleUserEmailVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //   try {
    //     const token = req.params.token;
    //     if (!token) {
    //       throw new Error("verification token missing.")
    //     }
    //     const verifiedToken = verifyToken(token);
    //     const email = verifiedToken
    //     const user = await prisma.user.findFirst({
    //       where:{
    //       }
    //     })
    //       await prisma.user.update({
    //           where:{
    //           }
    //       })
    //   res.status(200).json({
    //     success: true,
    //     message: 'Email verified successfully',
    //   });
    // } catch (error:unknown) {
    //   const errorMessage =
    //     error instanceof Error
    //       ? error.message
    //       : 'Invalid or expired verification link.';
    //   res.status(400).json({
    //     success: false,
    //     message: errorMessage,
    //   });
    // }
});
exports.handleUserEmailVerification = handleUserEmailVerification;
