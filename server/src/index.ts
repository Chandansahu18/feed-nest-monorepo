import express from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/user.Routes';
import postRouter from './routes/post.Routes';

dotenv.config();
const app = express();
const port = process.env.PORT;

// middleware for parsing json data
app.use(express.json());

app.use("/",userRouter);
app.use("/",postRouter);


app.listen(port,()=>{
    console.log("Server started at port:",port);
})