import { Box, Flex, Image, Text, VStack, Spinner, useToast } from "@chakra-ui/react";
import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Toggles between login and signup forms
  const toggleAuthMode = () => {
    setIsLogin((prev) => !prev);
    toast({
      title: `Switched to ${isLogin ? "Sign Up" : "Login"} mode`,
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <>
      {/* Main Authentication Form Container */}
      <Box border={"1px solid gray"} borderRadius={4} padding={5}>
        <VStack spacing={4}>
          {/* Logo */}
          <Image 
            src='/logo-white.png' 
            h={24} 
            cursor={"pointer"} 
            alt='Alum_Connect' 
            aria-label="Alum Connect Logo" 
          />
          
          {/* Loading Spinner or Form */}
          {loading ? (
            <Spinner label="Loading..." size="lg" />
          ) : isLogin ? (
            <Login setLoading={setLoading} />
          ) : (
            <Signup setLoading={setLoading} />
          )}

        
        </VStack>
      </Box>

      {/* Toggle Between Login/Signup */}
      <Box border={"1px solid gray"} borderRadius={4} padding={5}>
        <Flex alignItems={"center"} justifyContent={"center"}>
          <Box mx={2} fontSize={14}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </Box>
          <Box
            onClick={toggleAuthMode}
            color={"blue.500"}
            cursor={"pointer"}
            _hover={{ textDecoration: "underline" }} // Add underline on hover
            aria-label={isLogin ? "Switch to Sign Up" : "Switch to Log In"} // Add aria label for better accessibility
          >
            {isLogin ? "Sign up" : "Log in"}
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default AuthForm;
