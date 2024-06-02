import React, { useState } from 'react';
import { Box, Button, Input, Textarea, useToast } from '@chakra-ui/react';
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

  return (
    <Box px={20} ml='5' margin={100} >
    <Box p={5} shadow="md" borderWidth="1px" bg="black" borderColor={"white"} borderRadius={20}>
      <Input
        value={zoomLink}
        onChange={(e) => setZoomLink(e.target.value)}
        placeholder="Enter Zoom link"
        mb={5}
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter description"
        mb={5}
      />
      <Button onClick={handleCreateZoomLink} isLoading={isLoading} colorScheme="blue">
        Create Zoom Link
      </Button>
    </Box>
    </Box>
  );
};

export default AddZoomLink;
