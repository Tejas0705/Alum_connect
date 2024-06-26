import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddzoomLink from './Addzoomlink';
import CreatePost from './CreatePost';
import Home from './Home';
import ProfileLink from './ProfileLink';
import Search from './Search';
import Newaddzoom from './Newaddzoom';
import Newzoomlink from './Newzoomlink';
import ChatBox from './ChatBox';
import { VStack, HStack } from '@chakra-ui/react';

const SidebarItems = ({ authUser, isMobile }) => {
  const navigate = useNavigate();

  const handleNavigateToChat = () => {
    navigate('/chatpage', { state: { authUser } });
  };

  const items = (
    <>
      <Home />
      <Search />
      
      <Newzoomlink />
      <ChatBox onClick={handleNavigateToChat} />
      <CreatePost />
      <ProfileLink />
    </>
  );

  return isMobile ? (
    <HStack spacing={4} justifyContent="space-around" w="full">
      {items}
    </HStack>
  ) : (
    <VStack spacing={4} align="stretch">
      {items}
    </VStack>
  );
};

export default SidebarItems;
