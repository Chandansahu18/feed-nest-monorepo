import bcrypt from 'bcrypt';

const saltRounds = 10;

const generateHash = (password: string) => {
  bcrypt.hash(password, saltRounds, function (err, hash) {
    if (err) {
      return err;
    }
    return hash;
  });
};

export default generateHash;