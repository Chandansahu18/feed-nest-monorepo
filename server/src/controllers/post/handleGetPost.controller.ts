import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';
const prisma = new PrismaClient();

const handleGetPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { postId } = req.query;
        if (!postId) {
            throw new Error("required id is missing")
        }
        const post = await prisma.post.findUnique({
            where:{
                id: postId as string
            }
        })
        res.status(200).json({
            success:true,
            data: post
        })
    } catch (error) {
        const errorMessage =
      error instanceof Error
        ? error.message
        : 'Internal server error, please try again later';

    res.status(500).json({
      success: false,
      message: errorMessage,
    });
    }
};

export default handleGetPost;
