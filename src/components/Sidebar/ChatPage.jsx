import React, { useState } from 'react';
import { Flex, Text, Spinner, Avatar } from '@chakra-ui/react';
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
