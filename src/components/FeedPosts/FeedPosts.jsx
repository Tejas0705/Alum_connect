import { Box, Container, Text, VStack } from "@chakra-ui/react";
import FeedPost from "./FeedPost";
import useGetFeedPosts from "../../hooks/useGetFeedPosts";

const FeedPosts = () => {
  const { isLoading, posts } = useGetFeedPosts();

  return (
    <Container maxW={"container.sm"} paddingBottom={5} px={1}>
      {isLoading && (
        [0, 1, 2].map((_, idx) => (
          <VStack key={idx} gap={4} alignItems={"flex-start"} mb={10}>
            <Box>
              <Box display="flex" alignItems="center" gap="2">
                {/* Skeleton Circle */}
                <Box bg="gray.200" w="20px" h="20px" borderRadius="full" />

                <VStack alignItems="flex-start" spacing="2">
                  {/* Skeleton lines */}
                  <Box bg="gray.200" w="200px" h="10px" />
                  <Box bg="gray.200" w="200px" h="10px" />
                </VStack>
              </Box>
            </Box>
            {/* Skeleton Box */}
            <Box bg="gray.200" w="100%" h="400px" />
          </VStack>
        ))
      )}

      {!isLoading && posts.length > 0 && posts.map((post) => <FeedPost key={post.id} post={post} />)}
      {!isLoading && posts.length === 0 && (
        <VStack spacing={4} alignItems="center">
          <Text fontSize="md" color="red.400">
            Your Feed is blank since you don't follow anyone.
          </Text>
          <Text color="red.400">Follow your colleagues to view their posts. OR <br /> Your colleagues haven't posted yet!</Text>
        </VStack>
      )}
    </Container>
  );
};

export default FeedPosts;
