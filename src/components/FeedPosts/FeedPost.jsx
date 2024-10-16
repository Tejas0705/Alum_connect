import { Box, Image, Heading } from "@chakra-ui/react";
import PostFooter from "./PostFooter";
import PostHeader from "./PostHeader";
import useGetUserProfileById from "../../hooks/useGetUserProfileById";
const FeedPost = ({ post }) => {
  const { userProfile } = useGetUserProfileById(post.createdBy);

  return (
    <>
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

      {/* Post Header */}
      <PostHeader post={post} creatorProfile={userProfile || {}} />

      {/* Post Image */}
      <Box my={2} borderRadius={4} overflow="hidden">
        <Image src={post.imageURL || ''} alt="FEED POST IMG" w="100%" />
      </Box>

      {/* Post Footer */}
      <PostFooter post={post} creatorProfile={userProfile || {}} />
    </>
  );
};


export default FeedPost;
