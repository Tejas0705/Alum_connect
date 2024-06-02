import React from 'react';
import { Avatar, Box, Container, Spinner,Flex, Text, VStack } from '@chakra-ui/react';

import useGetZoomLinksByUser from '../../hooks/useGetZoomLinksByUser';

const ZoomLinkPage = () => {
  const { zoomLinks, loading, error } = useGetZoomLinksByUser();

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" thickness="4px" speed="0.70s" emptyColor="gray.200" color="blue.500" />
      </Flex>
    );
  }

  if (error) return <Text>Error: {error}</Text>;

  return (
    <Container maxW="container.md" py={10}>
      {zoomLinks.length > 0 ? (
        <VStack spacing={5} align="stretch">
          {zoomLinks.map(link => (
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
          ))}
        </VStack>
      ) : (
        <Text>No Zoom links found.</Text>
      )}
    </Container>
  );
};

export default ZoomLinkPage;
