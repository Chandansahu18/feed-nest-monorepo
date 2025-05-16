import express from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/user.Routes';
import postRouter from './routes/post.Routes';
import { PrismaClient } from '../generated/prisma';

dotenv.config();
const app = express();
const port = process.env.PORT;
const prisma = new PrismaClient();

// middleware for parsing json data
app.use(express.json());

const main = async () => {
  app.use('/', userRouter);
  app.use('/', postRouter);

  app.listen(port, async () => {
    console.log('Server started at port:', port);
  });
};
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
