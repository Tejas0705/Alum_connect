// useCreatePost.js
import { useState } from 'react';

const useCreatePost = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCreatePost = async (selectedFile, caption) => {
    // Your implementation here
  };

  return { isLoading, handleCreatePost };
};

export default useCreatePost;
