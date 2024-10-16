
import React, { useState } from 'react';
import { Box, Button, Input, VStack, useToast } from "@chakra-ui/react";
import { firestore } from "../../firebase/firebase";
import { setDoc, doc } from "firebase/firestore";

const UsnEntryForm = () => {
  const [usn, setUsn] = useState("");
  const toast = useToast();

  const handleUSNSubmit = async () => {
    if (!usn) {
      toast({
        title: "Error",
        description: "USN number is required",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      await setDoc(doc(firestore, "usnNumbers", usn), { usn });
      toast({
        title: "Success",
        description: "USN number added successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setUsn("");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={5} maxW="400px" mx="auto">
      <VStack spacing={4}>
        <Input
          placeholder="Enter USN Number"
          value={usn}
          onChange={(e) => setUsn(e.target.value)}
        />
        <Button colorScheme="blue" onClick={handleUSNSubmit}>
          Add USN
        </Button>
      </VStack>
    </Box>
  );
};

export default UsnEntryForm;
