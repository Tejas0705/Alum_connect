import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  Textarea,
  useToast,
  Center,
  useBreakpointValue,
  Container,
  Flex,
  Text,
  VStack,
  Avatar,
  Spinner,
} from '@chakra-ui/react';
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  doc,
} from 'firebase/firestore';
import { firestore } from '../../firebase/firebase';
import useAuthStore from '../../store/authStore';
import useGetZoomLinksByUser from '../../hooks/useGetZoomLinksByUser';

const ZoomLinkPage = () => {
  const [zoomLink, setZoomLink] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const toast = useToast();

  const { zoomLinks, loading, error } = useGetZoomLinksByUser();

  const handleCreateZoomLink = async () => {
    if (!zoomLink || !description) {
      toast({
        title: 'Error',
        description: 'Zoom link and description are required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const newZoomLink = {
        zoomLink,
        description,
        createdAt: serverTimestamp(),
        createdBy: authUser.uid,
        creatorUsername: authUser.displayName,
        creatorProfilePic: authUser.photoURL,
      };

      const zoomLinksCollectionRef = collection(firestore, 'zoomLinks');
      const userDocRef = doc(firestore, 'users', authUser.uid);

      const docRef = await addDoc(zoomLinksCollectionRef, newZoomLink);

      await updateDoc(userDocRef, {
        zoomLinks: arrayUnion(docRef.id),
      });

      toast({
        title: 'Success',
        description: 'Zoom link created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setZoomLink('');
      setDescription('');
    } catch (error) {
      console.error('Error creating Zoom link:', error);
      toast({
        title: 'Error',
        description: 'Failed to create Zoom link',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const boxMaxWidth = useBreakpointValue({ base: '100%', sm: '80%', md: '60%', lg: '40%' });

  return (
    <Container maxW="container.md" py={10}>
       <Box
        display={{ base: "block", md: "none" }}
        position="sticky"
        top="0"
        bg="black"
        zIndex="sticky"
        textAlign="left"
        mt={0}
        px={4} // Adjust padding as needed
        py={2} // Adjust padding as needed
        borderBottomWidth="1px"
        borderColor="gray.200"
      >
        <Heading as="h1" size="md">
          Alum Connect <br />
        </Heading>
      </Box>
      {loading ? (
        <Flex justifyContent="center" alignItems="center" height="100vh">
          <Spinner size="xl" thickness="4px" speed="0.70s" emptyColor="gray.200" color="blue.500" />
        </Flex>
      ) : error ? (
        <Text>Error: {error}</Text>
      ) : (
        <VStack spacing={5} align="stretch" mt={10} overflowY="auto">
          {zoomLinks.length > 0 ? (
            zoomLinks.map((link) => (
              <Box key={link.id} p={5} shadow="md" borderWidth="1px">
                <Flex align="center" mb={4}>
                  <Avatar src={link.creatorProfilePic} size="sm" />
                  <Text ml={3} fontWeight="bold">
                    {link.creatorUsername}
                  </Text>
                </Flex>
                <Text fontSize="xl">{link.description}</Text>
                <Text mt={4} color="blue">
                  <a href={link.zoomLink} target="_blank" rel="noopener noreferrer">
                    {link.zoomLink}
                  </a>
                </Text>
              </Box>
            )).reverse() // Reverse array to show newly added links at the top
          ) : (
            <Text>No Zoom links found.</Text>
          )}

          <Box
            p={5}
            shadow="md"
            borderWidth="1px"
            bg="gray.800"
            borderColor="purple.500"
            borderRadius={20}
            resize="horizontal"
            maxW={800}
            w="100%"
          >
            <Input
              value={zoomLink}
              onChange={(e) => setZoomLink(e.target.value)}
              placeholder="Enter Zoom link"
              mb={5}
              bg="gray.700"
              color="white"
              _placeholder={{ color: 'gray.400' }}
              borderRadius={10}
            />
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              mb={5}
              bg="gray.700"
              color="white"
              _placeholder={{ color: 'gray.400' }}
              borderRadius={10}
              resize="vertical"
              minHeight="200px"
            />
            <Button
              onClick={handleCreateZoomLink}
              isLoading={isLoading}
              colorScheme="purple"
              w="full"
              borderRadius={10}
              _hover={{ bg: 'blue.600' }}
            >
              Create Zoom Link
            </Button>
          </Box>
        </VStack>
      )}
    </Container>
  );
};

export default ZoomLinkPage;
