import bcrypt from 'bcrypt';

export const generateHash = async (password:string) =>{
   const saltRounds = 12;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash; 
}

export const compareHash = async (password:string,hashedPassword:string) =>{
      const checkPassword = await bcrypt.compare(password, hashedPassword)
      return checkPassword;
}