import React from "react";
import { Avatar, Box, Text, Flex } from "@chakra-ui/react";

const Comment = ({ comment }) => {
  return (
    <Flex w="full" align="center" gap={2}>
      <Avatar size="sm" name={comment.username} src={comment.avatar || ""} />
      <Box>
        <Text fontSize="sm" fontWeight={600}>
          {comment.username}{" "}
          <Text as="span" fontWeight={400}>
            {comment.text}
          </Text>
        </Text>
        <Text fontSize="xs" color="gray.500">
          {new Date(comment.createdAt).toLocaleString()}
        </Text>
      </Box>
    </Flex>
  );
};

export default Comment;
