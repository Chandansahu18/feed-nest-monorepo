import { PrismaClient } from '../../../generated/prisma';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

const handleGetAllComments = async (req: Request, res: Response): Promise<void> => {
    try {
        const { postId, commentId } = req.query;
        if (!postId && !commentId) {
            throw new Error("required id is missing")
        }
        if (commentId) {       
            const commentReplies = await prisma.postComment.findMany({
                where:{
                    commentId: commentId as string
                }
            })
            res.status(200).json({
                success:true,
            data: commentReplies
        })
    }else{
        const postComments = await prisma.postComment.findMany({
            where:{
                postId: postId as string
            },
            include:{
                post:true,
            }
        })
        res.status(200).json({
            success:true,
        data: postComments
    })

    }
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

export default handleGetAllComments;
