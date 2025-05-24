import { PrismaClient } from "../../../generated/prisma";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const handleGetUser = async (req:Request, res:Response) =>{
    
    try {
        const {accessToken} = req.cookies;



    } catch (error) {
        
    }
        
}

export default handleGetUser;