import express from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/user.Routes';
import postRouter from './routes/post.Routes';
import authRouter from './routes/auth.Routes';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(cookieParser());
app.use(cors({
  origin: [process.env.FRONTEND_BASE_URL as string],
  credentials: true,
  methods:["GET","POST","PATCH","DELETE"]
}));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.resolve("./src/views"));
app.use(express.json());

app.use('/', authRouter);
app.use('/user', userRouter);
app.use('/post', postRouter);

app.listen(port, async () => {
  console.log('Server started at port:', port);
});
