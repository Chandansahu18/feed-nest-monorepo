import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface CreatePostData {
  postTitle: string;
  postDescription: string;
  postBannerImage: string;
  postTags: string[];
  published: boolean;
}

const createPost = async (postData: CreatePostData) => {
  const response = await axios.post('/v1/post', postData, {
    withCredentials: true,
  });
  return response.data;
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      console.error('Error creating post:', error);
    },
  });
};