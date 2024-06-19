import React, { useState } from 'react';
import { Box, Button, Input, Textarea, useToast, Center, useBreakpointValue } from '@chakra-ui/react';
import { addDoc, collection, serverTimestamp, updateDoc, arrayUnion, doc } from 'firebase/firestore';
import { firestore } from '../../firebase/firebase';
import useAuthStore from '../../store/authStore';

const AddZoomLink = () => {
  const [zoomLink, setZoomLink] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const toast = useToast();

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

  // Dynamically adjust maxW based on screen size
  const boxMaxWidth = useBreakpointValue({ base: '100%', sm: '80%', md: '60%', lg: '40%' });

  return (
    <Center h="100vh">
      <Box 
        p={5} 
        shadow="md" 
        borderWidth="1px" 
        bg="gray.800" // Dark background color
        borderColor="purple.500" // Border color
        borderRadius={20}
        resize="horizontal"
        maxW={800} // Responsive maximum width
        w="100%" // Full width
      >
        <Input
          value={zoomLink}
          onChange={(e) => setZoomLink(e.target.value)}
          placeholder="Enter Zoom link"
          mb={5}
          bg="gray.700" // Darker input background
          color="white" // Text color
          _placeholder={{ color: 'gray.400' }} // Placeholder color
          borderRadius={10}
        />
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
          mb={5}
          bg="gray.700" // Darker textarea background
          color="white" // Text color
          _placeholder={{ color: 'gray.400' }} // Placeholder color
          borderRadius={10}
          resize="vertical" // Allow vertical resizing
          minHeight="200px" // Minimum height
        />
        <Button 
          onClick={handleCreateZoomLink} 
          isLoading={isLoading} 
          colorScheme="purple" 
          w="full"
          borderRadius={10}
          _hover={{ bg: 'blue.600' }} // Darker hover color
        >
          Create Zoom Link
        </Button>
      </Box>
    </Center>
  );
};

export default AddZoomLink;
