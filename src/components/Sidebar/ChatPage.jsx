import React, { useState, useEffect } from 'react';
import { Flex, Text, Spinner, Avatar, Box, Heading } from '@chakra-ui/react';
import useGetAllUser from '../../hooks/useGetAllUser';
import ChatWindow from './ChatWindow';
import { firestore } from '../../firebase/firebase'; // Adjust the path if necessary
import { doc, getDoc } from 'firebase/firestore';

const ChatPage = ({ currentUser }) => {
  const { users, loading, error } = useGetAllUser();
  const [selectedUser, setSelectedUser] = useState(null);
  const [validUsers, setValidUsers] = useState([]);

  useEffect(() => {
    const fetchValidUsers = async () => {
      const currentUserDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
      if (currentUserDoc.exists()) {
        const currentUserData = currentUserDoc.data();

        const filteredUsers = users.filter(user => 
          currentUserData.following.includes(user.uid) && currentUserData.followers.includes(user.uid)
        );

        setValidUsers(filteredUsers);
      }
    };

    if (currentUser && users.length > 0) {
      fetchValidUsers();
    }
  }, [currentUser, users]);

  const handleChatClick = (user) => {
    if (currentUser?.uid === user.uid) return;
    setSelectedUser(user);
  };

  return (
    <Flex direction="column" p={4}>
      <Box
        display={{ base: 'block', md: 'none' }}
        position="sticky"
        top="0"
        bg="black"
        zIndex="sticky"
        textAlign="left"
        mt={0}
        mb={2}
        px={4}
        py={2}
        borderBottomWidth="1px"
        borderColor="gray.200"
      >
        <Heading as="h1" size="md">
          Alum Connect <br />
        </Heading>
      </Box>
      {loading && <Spinner />}
      {error && <Text>Error: {error}</Text>}
      {!loading && !error && validUsers.length === 0 && (
        <Text>Follow people to chat.</Text>
      )}
      {!loading && !error && validUsers.length > 0 && (
        <Flex overflowX="auto" pb={4} alignItems="center">
          {validUsers.map((user) => (
            <Flex 
              key={user.uid}
              direction="column"
              alignItems="center"
              onClick={() => handleChatClick(user)}
              cursor="pointer"
              mx={2}
            >
              <Avatar size="md" name={user.username} src={user.profilePicURL} mb={2} />
              <Text>{user.username}</Text>
              {currentUser && currentUser.uid === user.uid && <Text fontSize="sm" color="gray.500">(You)</Text>}
            </Flex>
          ))}
        </Flex>
      )}
      {selectedUser && (
        <ChatWindow user={selectedUser} currentUser={currentUser} />
      )}
    </Flex>
  );
};

export default ChatPage;
