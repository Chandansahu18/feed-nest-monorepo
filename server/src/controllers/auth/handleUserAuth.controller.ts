import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';
import { generateHash } from '../../utils/hash';
import { generateToken } from '../../utils/authTokens';
import { validateUserData } from '../../utils/schemaValidate';
import sendMail from '../../utils/email';

const prisma = new PrismaClient();
const baseURL = process.env.BASE_URL ?? '';
const accessTokenExpiryTime = 10 * 60 * 1000;

const handleUserAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const validUserData = validateUserData.safeParse(req.body);
    if (!validUserData.data) {
      const errors = validUserData.error?.issues;
      const errorMessage =
      errors.length === 1 ? errors[0].message : 'missing required fields';
      throw new Error(errorMessage);
    }
    
    const { email, name, userName, password } = validUserData.data;
    
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      const accessToken = generateToken(email, accessTokenExpiryTime);
      const hashedPassword = await generateHash(password ?? '');
      await prisma.user.create({
        data: {
          name,
          userName,
          email,
          hashedPassword,
        },
      });

      await sendMail(email, 'sign up', 'Email verification link for signup', {
        redirectToEmailVerificationPageLink: `http://localhost:3000/v1/verify/${accessToken}`,
      });
      res.status(200).json({
        success: true,
        message: 'Email has been sent to your mail to verify your email.',
      });
    }

    if (!existingUser?.isEmailVerified) {
       const accessToken = generateToken(email, accessTokenExpiryTime);
       await sendMail(email, 'sign in', 'Email verification link for signin', {
        redirectToEmailVerificationPageLink: `${baseURL}/v1/verify/${accessToken}`,
      });
      res.status(200).json({
        success: true,
        message: 'Email has been sent to your mail to verify your email.',
      });
    }
    res.status(409).json({
      success:true,
      message:"User already exists, please signin to continue."
    })

  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Internal server error, please try again later';

    res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};

export default handleUserAuth;
