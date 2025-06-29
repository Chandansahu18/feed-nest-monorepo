import { useState, useEffect } from 'react';
import { IAllPosts } from '@shared/types';

// Mock hook - replace with your actual implementation
export const usePostsData = (cursorId?: string) => {
  const [data, setData] = useState<IAllPosts[] | undefined>(undefined);
  const [isPending, setIsPending] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setIsPending(true);
      
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - replace with actual API call
      const mockPosts: IAllPosts[] = [];
      
      setData(prevData => {
        if (cursorId && prevData) {
          return [...prevData, ...mockPosts];
        }
        return mockPosts;
      });
      
      setHasMore(mockPosts.length > 0);
      setIsPending(false);
    };

    fetchData();
  }, [cursorId]);

  return { data, isPending, hasMore };
};