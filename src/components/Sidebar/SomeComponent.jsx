import React from 'react';
import { useNavigate } from 'react-router-dom';

const SomeComponent = () => {
  const navigate = useNavigate();
  const handleChatPageNavigation = (authUser) => {
    navigate('/chatpage', { state: { authUser } });
  };

  return (
    <button onClick={() => handleChatPageNavigation(authUser)}>Go to Chat Page</button>
  );
};

export default SomeComponent;