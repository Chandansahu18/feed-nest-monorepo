import { z } from "zod";

// User Auth Schema
const userAuthData = z.object({
    name:z.string().optional(),
    userName: z.string().optional(),
    email:z.string(),
    password:z.string().optional(),
     
    })

const userAuthQuotesData = z.object({
  quotes: z.object({ signup: z.string(), signin: z.string() })
})    
    
export type TUserAuth = z.infer<typeof userAuthData>;
export type TUserAuthQuotes = z.infer<typeof userAuthQuotesData>