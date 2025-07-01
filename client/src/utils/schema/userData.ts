import { z } from "zod";

const userDataUpdate = z.object({
  name: z.string().optional(),
  userName: z.string().optional(),
  email: z.string(),
  password: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  profileBanner: z.string().optional(),
  location: z.string().optional(),
  linkedInHandle: z.string().optional(),
  twitterHandle: z.string().optional(),
  githubHandle: z.string().optional(),
});

export type TUserDataUpdate = z.infer<typeof userDataUpdate>;
