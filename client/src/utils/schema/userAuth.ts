import { z } from "zod";

// Email Auth Schema
const emailAuthData = z.object({
  name: z.string().optional(),
  userName: z.string().optional(),
  email: z.string(),
  password: z.string().optional(),
});
// Google Auth Schema
const googleAuthData = z.object({
  name: z.string(),
  email: z.string(),
});

// User Auth Section Quotes Schema
const userAuthQuotesData = z.object({
  quotes: z.object({ signup: z.string(), signin: z.string() }),
});

// User Auth Section State Props Schema
const setEmailAuthPropData = z.object({
  setIsEmailAuth: z.function().args(z.boolean()).returns(z.void())
})

export type TEmailAuth = z.infer<typeof emailAuthData>;
export type TGoogleAuth = z.infer<typeof googleAuthData>;
export type TUserAuthQuotes = z.infer<typeof userAuthQuotesData>;
export type TSetEmailAuthProp = z.infer<typeof setEmailAuthPropData>
