import jwt from 'jsonwebtoken';

const tokenSecret = process.env.TOKEN_SECRET;

export const generateToken = (data: string, expiresIn: number) => {
  return jwt.sign({ data }, `${tokenSecret}`, { expiresIn });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, `${tokenSecret}`);
};
