import { z } from 'zod';

export const validateUserData = (
  name: string,
  userName: string,
  email: string,
  password: string,
) => {
  const validateName = z
    .string()
    .min(6, 'name must be minimum of length upto 6 characters')
    .max(16, 'name must be maximum of length upto 16 characters');
  const validateUserName = z
    .string()
    .min(6, 'username must be minimum of length upto 6 characters')
    .max(16, 'username must be maximum of length upto 16 characters');
  const validateEmail = z.string().email('Invalid email address');
  const validatePassword = z
    .string()
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      'password must be at least of 8 character and at most of 16 characters & must contain 1 uppercase, 1 lowercase, 1 number & 1 special character',
    );

  const validName = validateName.safeParse(name);
  const validUserName = validateUserName.safeParse(userName);
  const validEmail = validateEmail.safeParse(email);
  const validPassword = validatePassword.safeParse(password);
  return {
    validName,
    validUserName,
    validEmail,
    validPassword,
  };
};
