import React from 'react';
import axios from 'axios';
import { IconBrandGoogle } from '@tabler/icons-react';

const GoogleAuthButton: React.FC = () => {
const backendURL = import.meta.env.VITE_BACKEND_BASE_URL;

  const handleGoogleAuth = async () => {
    try {

      const response = await axios.get(`${backendURL}/v1/auth/google`, {
        withCredentials: true, 
      });
       
      console.log(response);
      
    } catch (error) {
      console.error('Google auth failed:', error);

    }
  };

  return (
    <button
      onClick={handleGoogleAuth}
      className="flex items-center justify-center gap-2 bg-red-400 text-gray-800 font-medium py-2 px-4 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <IconBrandGoogle/>
      Continue with Google
    </button>
  );
};

export default GoogleAuthButton;