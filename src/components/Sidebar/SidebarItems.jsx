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
import { Button, VStack ,Flex} from '@chakra-ui/react';

const SidebarItems = ({ authUser , isMobile = false}) => {
  const navigate = useNavigate();
  const { handleLogout } = useLogout();

  const handleNavigateToChat = () => {
    navigate('/chatpage', { state: { authUser } });
  };

  return (
    <Flex direction={isMobile ? "row" : "column"} gap={isMobile ? 4 : 5} align="center">
      <Home />
      <Search />
      <Newaddzoom />
      <Newzoomlink />
      <ChatBox onClick={handleNavigateToChat} />
      <CreatePost />
      <ProfileLink />
      
    </Flex>
  );
};

export default SidebarItems;
