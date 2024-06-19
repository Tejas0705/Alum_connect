import React, { useState, useEffect, useRef } from 'react';
import { Flex, Text, Input, Button, Box } from '@chakra-ui/react';
import { collection, addDoc, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { firestore } from '../../firebase/firebase';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const ChatWindow = ({ user, currentUser }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentDate, setCurrentDate] = useState('');
  const messagesEndRef = useRef(null);

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

    // Fetch current date for display at the top
    const currentDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setCurrentDate(currentDate);
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const renderDateSection = () => {
    if (messages.length === 0) return null;

    const firstMessageDate = new Date(messages[0].timestamp?.toDate());
    const currentDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const messageDate = firstMessageDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    if (currentDate === messageDate) {
      return (
        <Flex align="center" justify="center" my={2} color="gray.500">
          <Box borderColor="gray.200" />
          <Text fontSize="sm" px={2} bg="black" color="white">
            Today
          </Text>
        </Flex>
      );
    } else {
      return (
        <Flex align="center" justify="center" my={2} color="gray.500">
          <Box borderColor="gray.200" />
          <Text fontSize="sm" px={2} bg="black" color="white">
            {messageDate}
          </Text>
        </Flex>
      );
    }
  };

  return (
    <Flex direction="column" p={4} border="1px solid" borderColor="gray.300" borderRadius="md" h="500px">
      {/* Sticky Username Section */}
      <Flex
        position="sticky"
        top="0"
        zIndex="sticky"
        bg="blue.500"
        color="white"
        px={4}
        py={2}
        borderBottom="1px solid"
        borderColor="gray.200"
        mb={4}
      >
        {/* Use Link to navigate to profile page */}
        <Link to={`/${user.username}`} style={{ textDecoration: 'none' }}>
          <Text fontSize="lg" fontWeight="bold" cursor="pointer" pl={6}>
            {user.username}
          </Text>
        </Link>
      </Flex>

      {/* Date Section */}
      {renderDateSection()}

      {/* Messages Section */}
      <Flex direction="column" flex="1" overflowY="auto" mb={4} maxHeight="calc(100% - 120px)">
        {messages.map((msg, index) => (
          <Box
            key={index}
            alignSelf={msg.userId === currentUser.uid ? 'flex-end' : 'flex-start'}
            bg={msg.userId === currentUser.uid ? 'blue.200' : 'gray.200'}
            color="black"
            p={3}
            borderRadius="md"
            mb={2}
            maxW="70%"
            boxShadow="sm"
          >
            <Text>{msg.text}</Text>
            <Text fontSize="xs" color="gray.500">
              {new Date(msg.timestamp?.toDate()).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
            </Text>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Flex>

      {/* Message Input Section */}
      <Flex>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          mr={2}
          placeholder="Type your message..."
          bg="black.100"
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
