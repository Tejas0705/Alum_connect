import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Flex, Text, Avatar, Box, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useShowToast from "../../hooks/useShowToast"; // Adjust the import path as necessary

const FollowersFollowingModal = ({ isOpen, onClose, title, users, onRemoveFollower }) => {
  const showToast = useShowToast();

  const handleRemoveFollower = async (userId) => {
    try {
      await onRemoveFollower(userId); // Ensure this function handles the database operation
      showToast("Success", "User removed from followers list", "success");
    } catch (error) {
      showToast("Error", "Failed to remove user", "error");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize="lg" fontWeight="bold" textAlign="center">{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {users.length === 0 ? (
            <Text textAlign="center" color="gray.500">No users found</Text>
          ) : (
            <VStack spacing={3} align="stretch">
              {users.map((user) => (
                <Flex
                  key={user.uid}
                  alignItems="center"
                  p={3}
                  borderRadius="md"
                  _hover={{ bg: "whiteAlpha.100", transform: "scale(1.02)", transition: "all 0.2s ease-in-out" }}
                  transition="all 0.2s ease-in-out"
                  border="1px solid"
                  borderColor="gray.200"
                >
                  {title === 'Followers' ? (
                    <Flex alignItems="center" gap={4} w="full">
                      <Avatar src={user.profilePicURL} alt={`${user.username}'s profile`} size="md" />
                      <Box>
                        <Text fontWeight="bold" fontSize="md">{user.username}</Text>
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleRemoveFollower(user.uid)}
                        >
                          Remove
                        </Button>
                      </Box>
                    </Flex>
                  ) : (
                    <Link to={`/${user.username}`} style={{ width: '100%' }}>
                      <Flex alignItems="center" gap={4} w="full">
                        <Avatar src={user.profilePicURL} alt={`${user.username}'s profile`} size="md" />
                        <Box>
                          <Text fontWeight="bold" fontSize="md">{user.username}</Text>
                          {user.profilePicURL && <Text fontSize="sm" color="gray.600">Profile picture available</Text>}
                        </Box>
                      </Flex>
                    </Link>
                  )}
                </Flex>
              ))}
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FollowersFollowingModal;
