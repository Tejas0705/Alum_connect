import React, { useState, useEffect, useRef } from 'react';
import { Flex, Text, Input, Button, Box } from '@chakra-ui/react';
import { collection, addDoc, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { firestore } from '../../firebase/firebase';
import { Link } from 'react-router-dom';

const ChatWindow = ({ user, currentUser }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentDate, setCurrentDate] = useState('');
  const messagesEndRef = useRef(null);

  const chatId = [currentUser.uid, user.uid].sort().join('_');

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

  const renderDateSections = () => {
    const dateSections = [];

    if (messages.length > 0) {
      let currentDate = new Date(messages[0].timestamp?.toDate()).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      let currentMessages = [];

      messages.forEach((msg) => {
        const msgDate = new Date(msg.timestamp?.toDate()).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        if (msgDate !== currentDate) {
          dateSections.push({ date: currentDate, messages: currentMessages });
          currentDate = msgDate;
          currentMessages = [];
        }

        currentMessages.push(msg);
      });

      dateSections.push({ date: currentDate, messages: currentMessages });
    }

    return dateSections.map((section, index) => (
      <React.Fragment key={index}>
        <Flex align="center" justify="center" my={2} color="gray.500">
          <Box borderColor="gray.200" />
          <Text fontSize="sm" px={2} bg="black" color="white">
            {section.date === currentDate ? 'Today' : section.date}
          </Text>
        </Flex>
        {section.messages.map((msg, index) => (
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
            style={{ position: 'sticky', bottom: '0' }}
          >
            <Text>{msg.text}</Text>
            <Text fontSize="xs" color="gray.500">
              {new Date(msg.timestamp?.toDate()).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
            </Text>
          </Box>
        ))}
      </React.Fragment>
    ));
  };

  return (
    <Flex direction="column" p={4} border="1px solid" borderColor="gray.300" borderRadius="md" h={{ base: '380px', md: '500px' }}>
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
        <Link to={`/${user.username}`} style={{ textDecoration: 'none' }}>
          <Text fontSize="lg" fontWeight="bold" cursor="pointer" pl={6}>
            {user.username}
          </Text>
        </Link>
      </Flex>

      <Flex direction="column" flex="1" overflowY="auto" mb={4} maxHeight="calc(100% - 120px)">
        {renderDateSections()}
        <div ref={messagesEndRef} />
      </Flex>

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
        <Button onClick={handleMessageSubmit} colorScheme="blue" borderRadius="full" _hover={{ bg: 'blue.500' }}>
          Send
        </Button>
      </Flex>
    </Flex>
  );
};

export default ChatWindow;
