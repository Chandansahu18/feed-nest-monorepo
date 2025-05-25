import { z } from 'zod';

export const validateUserData = z.object({
  name: z
    .string()
    .min(6, 'name must be minimum of length upto 6 characters')
    .max(16, 'name must be maximum of length upto 16 characters'),
  userName: z
    .string()
    .min(6, 'username must be minimum of length upto 6 characters')
    .max(16, 'username must be maximum of length upto 16 characters')
    .optional(),
  email: z.string().email(),
  password: z
    .string()
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      'password must be at least of 8 character and at most of 16 characters & must contain 1 uppercase, 1 lowercase, 1 number & 1 special character',
    )
    .optional(),
  avatar: z.string().startsWith('https://').optional(),
  profileBanner: z.string().startsWith('https://').optional(),
  bio: z.string().min(1).max(250).optional(),
});
