import React from 'react';
import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom'; // Correct import

const Verification = () => {
  const navigate = useNavigate(); // useNavigate hook

  const handleGoToLogin = () => {
    // Ensure this matches the correct path to the login page
  };

  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading as="h1" size="xl" mb={4}>
        Email Verification Required
      </Heading>
      <Text fontSize="lg" mb={6}>
        Please check your email for a verification link. You must verify your email to log in.
      </Text>
      {/*<Button colorScheme="blue" onClick={handleGoToLogin}>
        Go to Login
      </Button>*/}
    </Box>
  );
};

export default Verification;
