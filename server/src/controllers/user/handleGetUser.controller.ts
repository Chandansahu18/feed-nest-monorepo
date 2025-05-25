import { PrismaClient } from "../../../generated/prisma";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const handleGetUser = async (req:Request, res:Response) =>{
    
    try {
        const {accessToken} = req.cookies;
       res.status(200).json({
        success:true,
        message:"User data"
       })
        


    } catch (error) {
        
    }
        
}

export default handleGetUser;