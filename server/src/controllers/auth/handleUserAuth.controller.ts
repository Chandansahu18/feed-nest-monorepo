import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';
import { validateUserData } from '../../utils/schemaValidate';
import { generateHash } from '../../utils/hash';
import { generateToken, verifyToken } from '../../utils/authTokens';

const prisma = new PrismaClient();
const accessTokenExpiryTime = parseInt(process.env.ACCESS_TOKEN_EXPIRY ?? '1*60*60*1000'); //Default expiry of accessToken 10 minutes
const refreshTokenExpiryTime = parseInt(process.env.REFRESH_TOKEN_EXPIRY ?? '24*60*60*1000'); //Default expiry of accessToken 60 minutes
const handleUserAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, userName, name, password } = req.body;
    // validating user data  
    const validUserData = validateUserData(name,userName,email,password);
    const hashPassword = await generateHash(password);

    const accessToken = generateToken("1234",accessTokenExpiryTime);
    const refreshToken = generateToken("1234",refreshTokenExpiryTime);

    const verifyAccessToken = verifyToken(accessToken);
    const verifyRefreshToken = verifyToken(refreshToken);

    console.log(verifyAccessToken, verifyRefreshToken);
    
    

    // const existingUser = await prisma.user.findUnique({
    //   where: {
    //     email: email,
    //   },
    // });

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
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Internal server error, please try again later';

    res.status(500).json({
      success: false,
      message: errorMessage,
      error: error,
    });
  }
};

export default handleUserAuth;
