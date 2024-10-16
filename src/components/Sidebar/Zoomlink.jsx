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
  Heading,
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
import { format } from 'date-fns';

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
        description: 'Link URL and description are required',
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
        username: authUser.username || 'Anonymous',
        creatorProfilePic: authUser.photoURL || '',
      };

      const zoomLinksCollectionRef = collection(firestore, 'zoomLinks');
      const userDocRef = doc(firestore, 'users', authUser.uid);

      const docRef = await addDoc(zoomLinksCollectionRef, newZoomLink);

      await updateDoc(userDocRef, {
        zoomLinks: arrayUnion(docRef.id),
      });

      toast({
        title: 'Success',
        description: 'Link posted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setZoomLink('');
      setDescription('');
    } catch (error) {
      console.error('Error posting link:', error);
      toast({
        title: 'Error',
        description: 'Failed to post link',
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
    <Container maxW="container.md" py={10} position="relative">
      {loading ? (
        <Flex justifyContent="center" alignItems="center" height="100vh">
          <Spinner size="xl" thickness="4px" speed="0.70s" emptyColor="gray.200" color="blue.500" />
        </Flex>
      ) : error ? (
        <Text>Error: {error}</Text>
      ) : (
        <VStack spacing={5} align="stretch" mt={0} overflowY="auto" maxHeight="75vh">
          <Box
            display={{ base: "block", md: "none" }}
            position="sticky"
            top="0"
            bg="black"
            zIndex="sticky"
            textAlign="left"
            mt={0}
            px={4}
            py={2}
            borderBottomWidth="1px"
            borderColor="gray.200"
          >
            <Heading as="h1" size="md">
              Alum Connect <br />
            </Heading>
          </Box>

          {/* Section for displaying existing Zoom links */}
          <VStack spacing={5} align="stretch" w="100%" overflowY="auto" maxHeight="50vh">
            {zoomLinks.length > 0 ? (
              zoomLinks.map((link) => (
                <Box key={link.id} p={5} shadow="md" borderWidth="1px" w="100%">
                  <Flex align="center" mb={4}>
                    <Avatar src={link.creatorProfilePic} size="sm" />
                    <Text ml={3} fontWeight="bold" color={"white"}>
                      {link.username || 'Anonymous'}
                    </Text>
                  </Flex>
                  <Text fontSize="xl">{link.description}</Text>
                  <Text mt={4} color="blue">
                    <a href={link.zoomLink} target="_blank" rel="noopener noreferrer">
                      {link.zoomLink}
                    </a>
                  </Text>
                  {link.createdAt && (
                    <Text mt={2} fontSize="sm" color="gray.500" textAlign="right">
                      {format(link.createdAt.toDate(), 'PPpp')}
                    </Text>
                  )}
                </Box>
              )).reverse() // Reverse array to show newly added links at the top
            ) : (
              <Text>No Links Found!!</Text>
            )}
          </VStack>

          {/* Section for adding new Zoom links */}
          <Box
            p={5}
            shadow="md"
            borderWidth="1px"
            bg="gray.800"
            borderColor="purple.500"
            borderRadius={20}
            resize="horizontal"
            maxW={5000}
            w="100%"
            position="sticky"
            bottom={0} // Adjusted to stick it to the bottom of the container
            zIndex={10}
          >
            <Input
              value={zoomLink}
              onChange={(e) => setZoomLink(e.target.value)}
              placeholder="Enter link"
              mb={3}
              bg="gray.700"
              color="white"
              _placeholder={{ color: 'gray.400' }}
              borderRadius={10}
            />
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              mb={3}
              bg="gray.700"
              color="white"
              _placeholder={{ color: 'gray.400' }}
              borderRadius={10}
              resize="vertical"
              minHeight="80px"
            />
            <Button
              onClick={handleCreateZoomLink}
              isLoading={isLoading}
              colorScheme="purple"
              w="full"
              borderRadius={10}
              _hover={{ bg: 'blue.600' }}
            >
              Post Link in public
            </Button>
          </Box>
        </VStack>
      )}
    </Container>
  );
};

export default ZoomLinkPage;
