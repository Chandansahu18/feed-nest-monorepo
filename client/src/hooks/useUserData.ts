// Mock hook for user data - replace with actual implementation
import { useState, useEffect } from "react";

interface UserData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface UseUserDataReturn {
  data: {
    data: UserData | null;
  } | null;
  loading: boolean;
  error: string | null;
}

export const useUserData = (): UseUserDataReturn => {
  const [data, setData] = useState<{ data: UserData | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const fetchUserData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock user data - replace with actual API call
        const mockUser: UserData = {
          id: "1",
          name: "John Doe",
          email: "john.doe@example.com",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
        };
        
        setData({ data: mockUser });
      } catch (err) {
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return { data, loading, error };
};