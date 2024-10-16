import React, { useState, useEffect } from "react";
import { VStack, HStack } from "@chakra-ui/react";
import { query, collection, where, onSnapshot } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import NotificationElement from "./Notificationelement";
import { useNavigate } from 'react-router-dom';
import Home from "./Home";
import Search from "./Search";
import Newzoomlink from "./Newzoomlink";
import ChatBox from "./ChatBox";
import CreatePost from "./CreatePost";
import ProfileLink from "./ProfileLink";

const SidebarItems = ({ authUser, isMobile }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const handleNavigateToChat = () => {
    navigate('/chatpage', { state: { authUser } });
  };
  useEffect(() => {
    if (!authUser) return;
  
    const q = query(
      collection(firestore, "notifications"),
      where("receiverId", "==", authUser),
      where("read", "==", false)
    );
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log("Unread Notifications Count:", snapshot.size); // Debug line
      setUnreadCount(snapshot.size);
    });
  
    return () => unsubscribe();
  }, [authUser]);
  
  const items = (
    <>
      <Home />
      <Search />
      <Newzoomlink />
      <ChatBox onClick={handleNavigateToChat} />
      <NotificationElement unreadCount={unreadCount} />
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
