import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.Routes';
import postRouter from './routes/post.Routes';
import authRouter from './routes/auth.Routes';
import { restrictToAuthorisedUser } from './middlewares/restrictToAuthorisedUser.middleware';
import { authLimiter, postDataAccessLimiter, userDataAccessLimiter } from './middlewares/limiter.middleware';

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
app.set("views", path.resolve("./dist/views"));
app.use(express.json({limit:'10mb'}));

app.use('/', authLimiter, authRouter);
app.use('/', restrictToAuthorisedUser, userRouter);
app.use('/', restrictToAuthorisedUser, postRouter);

app.listen(port, async () => {
  console.log('Server started at port:', port);
});
