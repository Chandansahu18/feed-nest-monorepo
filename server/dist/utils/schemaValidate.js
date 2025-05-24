"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserData = void 0;
const zod_1 = require("zod");
exports.validateUserData = zod_1.z.object({
    name: zod_1.z.string()
        .min(6, 'name must be minimum of length upto 6 characters')
        .max(16, 'name must be maximum of length upto 16 characters'),
    userName: zod_1.z
        .string()
        .min(6, 'username must be minimum of length upto 6 characters')
        .max(16, 'username must be maximum of length upto 16 characters'),
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z
        .string()
        .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, 'password must be at least of 8 character and at most of 16 characters & must contain 1 uppercase, 1 lowercase, 1 number & 1 special character').optional()
});
