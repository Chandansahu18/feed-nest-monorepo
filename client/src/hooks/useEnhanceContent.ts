import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

interface EnhanceContentData {
  title?: string;
  blog?: string;
}

const enhanceContent = async (content: EnhanceContentData): Promise<string> => {
  const response = await axios.patch('/v1/enhance', content, {
    withCredentials: true,
  });
  return response.data.data;
};

export const useEnhanceContent = () => {
  return useMutation({
    mutationFn: enhanceContent,
    onError: (error) => {
      console.error('Error enhancing content:', error);
    },
  });
};