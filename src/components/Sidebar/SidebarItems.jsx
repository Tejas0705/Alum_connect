import React from 'react';
import { useNavigate } from 'react-router-dom';
import useLogout from '../../hooks/useLogout';
import AddzoomLink from './Addzoomlink';
import CreatePost from './CreatePost';
import Home from './Home';
//import Notifications from './Notifications';
import ProfileLink from './ProfileLink';
import Search from './Search';
import Newaddzoom from './Newaddzoom';
import Newzoomlink from './Newzoomlink';
import ChatBox from './ChatBox';
import { Button, VStack } from '@chakra-ui/react';

const SidebarItems = ({ authUser }) => {
  const navigate = useNavigate();
  const { handleLogout } = useLogout();

  const handleNavigateToChat = () => {
    navigate('/chatpage', { state: { authUser } });
  };

  return (
    <VStack spacing={4} align="stretch">
      <Home />
      <Search />
      <Newaddzoom />
      <Newzoomlink />
      <ChatBox onClick={handleNavigateToChat} />
      <CreatePost />
      <ProfileLink />
      
    </VStack>
  );
};

export default SidebarItems;
