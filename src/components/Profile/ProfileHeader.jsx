import { Avatar, AvatarGroup, Button, Flex, Text, VStack, useDisclosure, Box, Heading } from "@chakra-ui/react";
import useUserProfileStore from "../../store/userProfileStore";
import useAuthStore from "../../store/authStore";
import EditProfile from "./EditProfile";
import useFollowUser from "../../hooks/useFollowUser";
import { BiLogOut } from "react-icons/bi";
import useLogout from "../../hooks/useLogoutNew";

const ProfileHeader = () => {
  const { handleLogout, isLoggingOut } = useLogout();
  const { userProfile } = useUserProfileStore();
  const authUser = useAuthStore((state) => state.user);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isFollowing, isUpdating, handleFollowUser } = useFollowUser(userProfile?.uid);
  const visitingOwnProfileAndAuth = authUser && authUser.username === userProfile.username;
  const visitingAnotherProfileAndAuth = authUser && authUser.username !== userProfile.username;

  return (
    <Flex gap={{ base: 0, sm: 10 }} paddingBottom={5} marginTop={0} direction={{ base: "column", sm: "row" }}>
      <Box
        display={{ base: "block", md: "none" }}
        position="sticky"
        top="0"
        bg="black"
        zIndex="sticky"
        textAlign="left"
        mt={0}
        mb={5}
        paddingTop={0}
        px={4}
        paddingBottom={2}
        borderBottomWidth="1px"
        borderColor="gray.200"
      >
        <Flex alignItems="center" justifyContent="space-between">
          <Heading as="h1" size="md">
            Alum Connect
          </Heading>
          <Flex
            onClick={handleLogout}
            alignItems="center"
            gap={2}
            _hover={{ bg: "whiteAlpha.400" }}
            borderRadius={6}
            p={2}
            w="auto"
            mt="auto"
            justifyContent="flex-end"
          >
            <BiLogOut size={25} />
            <Button
              display={{ base: "none", md: "block" }}
              variant="ghost"
              fontSize={14}
              color={"red"}
              isLoading={isLoggingOut}
            >
              Log
            </Button>
          </Flex>
        </Flex>
      </Box>

      <AvatarGroup size={{ base: "xl", md: "2xl" }} justifySelf="center" alignSelf="flex-start" mx="auto">
        <Avatar src={userProfile.profilePicURL} alt="As a programmer logo" />
      </AvatarGroup>

      <VStack alignItems="start" gap={2} mx="auto" flex={1}>
        <Flex
          gap={4}
          direction={{ base: "column", sm: "row" }}
          justifyContent={{ base: "center", sm: "flex-start" }}
          alignItems="center"
          w="full"
        >
          <Text fontSize={{ base: "sm", md: "lg" }}>{userProfile.username}</Text>
          {visitingOwnProfileAndAuth && (
            <Flex gap={4} alignItems="center" justifyContent="center">
              <Button
                bg="white"
                color="black"
                _hover={{ bg: "whiteAlpha.800" }}
                size={{ base: "xs", md: "sm" }}
                onClick={onOpen}
              >
                Edit Profile
              </Button>
            </Flex>
          )}
          {visitingAnotherProfileAndAuth && (
            <Flex gap={4} alignItems="center" justifyContent="center">
              <Button
                bg="blue.500"
                color="white"
                _hover={{ bg: "blue.600" }}
                size={{ base: "xs", md: "sm" }}
                onClick={handleFollowUser}
                isLoading={isUpdating}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            </Flex>
          )}
        </Flex>

        <Flex alignItems="center" gap={{ base: 2, sm: 4 }}>
          <Text fontSize={{ base: "xs", md: "sm" }}>
            <Text as="span" fontWeight="bold" mr={1}>
              {userProfile.posts.length}
            </Text>
            Posts
          </Text>
          <Text fontSize={{ base: "xs", md: "sm" }}>
            <Text as="span" fontWeight="bold" mr={1}>
              {userProfile.followers.length}
            </Text>
            Followers
          </Text>
          <Text fontSize={{ base: "xs", md: "sm" }}>
            <Text as="span" fontWeight="bold" mr={1}>
              {userProfile.following.length}
            </Text>
            Following
          </Text>
        </Flex>
        <Flex alignItems="center" gap={4}>
          <Text fontSize="sm" fontWeight="bold">
            {userProfile.fullName}
          </Text>
        </Flex>
        <Text fontSize="sm">{userProfile.bio}</Text>
      </VStack>

      {isOpen && <EditProfile isOpen={isOpen} onClose={onClose} />}
    </Flex>
  );
};

export default ProfileHeader;
