import React, { useState } from 'react';
import { Flex, Text, Spinner, Avatar,Box,Heading} from '@chakra-ui/react';
import useGetAllUser from '../../hooks/useGetAllUser';
import ChatWindow from './ChatWindow';

const ChatPage = ({ currentUser }) => {
  const { users, loading, error } = useGetAllUser();
  const [selectedUser, setSelectedUser] = useState(null);

  const handleChatClick = (user) => {
    if (currentUser?.uid === user.uid) return;
    setSelectedUser(user);
  };

  return (
    <Flex direction="column" p={4}>
       <Box
        display={{ base: "block", md: "none" }}
        position="sticky"
        top="0"
        bg="black"
        zIndex="sticky"
        textAlign="left"
        mt={0}
        mb={2}
        px={4} // Adjust padding as needed
        py={2} // Adjust padding as needed
        borderBottomWidth="1px"
        borderColor="gray.200"
      >
        <Heading as="h1" size="md">
          Alum Connect <br />
        </Heading>
      </Box>
     {/*} <Text fontSize="xl" mb={4}>Chat with People</Text>*/}
      {loading && <Spinner />}
      {error && <Text>Error: {error}</Text>}
      {!loading && !error && (
        <Flex overflowX="auto" pb={4} alignItems="center">
          {users.map((user) => (
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
