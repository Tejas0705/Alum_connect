import React, { useState, useEffect } from 'react';
import { Flex, Text, Input, Button, Box } from '@chakra-ui/react';
import { collection, addDoc, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { firestore } from '../../firebase/firebase';

const ChatWindow = ({ user, currentUser }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const chatId = [currentUser.uid, user.uid].sort().join('_'); // Generate a consistent chat ID

  useEffect(() => {
    const fetchMessages = async () => {
      const messagesCollection = collection(firestore, 'chats', chatId, 'messages');
      const messagesQuery = query(messagesCollection, orderBy('timestamp'), limit(20));
      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const newMessages = snapshot.docs.map((doc) => doc.data());
        setMessages(newMessages);
      });

      return () => unsubscribe();
    };

    fetchMessages();
  }, [chatId]);

  const handleMessageSubmit = async () => {
    if (message.trim() === '') return;

    try {
      const messagesCollection = collection(firestore, 'chats', chatId, 'messages');
      await addDoc(messagesCollection, {
        userId: currentUser.uid,
        text: message,
        timestamp: new Date(),
      });
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Flex
      direction="column"
      p={4}
      border="1px solid"
      borderColor="gray.300"
      borderRadius="md"
      bgGradient="linear(to-r, black.100, white)"
      boxShadow="md"
    >
      <Text fontSize="xl" mb={4}>
        Chat with {user.username}
      </Text>
      <Flex direction="column" mb={4} maxH="300px" overflowY="auto">
        {messages.map((msg, index) => (
          <Box
            key={index}
            alignSelf={msg.userId === currentUser.uid ? 'flex-end' : 'flex-start'}
            bg={msg.userId === currentUser.uid ? 'blue.200' : 'gray.200'}
            color="black"
            p={2}
            borderRadius="lg"
            mb={2}
            maxW="70%"
            boxShadow="sm"
          >
            <Text>{msg.text}</Text>
          </Box>
        ))}
      </Flex>
      <Flex mt={4}>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          mr={2}
          placeholder="Type your message..."
          bg="white"
          borderRadius="full"
          boxShadow="sm"
        />
        <Button
          onClick={handleMessageSubmit}
          colorScheme="blue"
          borderRadius="full"
          _hover={{ bg: 'blue.500' }}
        >
          Send
        </Button>
      </Flex>
    </Flex>
  );
};

export default ChatWindow;
