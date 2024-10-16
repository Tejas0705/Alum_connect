import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Flex,
  Text,
  VStack,
  useDisclosure,
  AvatarGroup,
  Heading
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useFollowUser from "../../hooks/useFollowUser";
import useUserProfileStore from "../../store/userProfileStore";
import useAuthStore from "../../store/authStore";
import EditProfile from "./EditProfile";
import { BiLogOut } from "react-icons/bi";
import useLogout from "../../hooks/useLogoutNew";
import FollowersFollowingModal from './FollowersFollowinModal';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { firestore } from "../../firebase/firebase";

const ProfileHeader = () => {
  const { handleLogout, isLoggingOut } = useLogout();
  const { userProfile } = useUserProfileStore();
  const authUser = useAuthStore((state) => state.user);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalTitle, setModalTitle] = useState('');
  const [modalUsers, setModalUsers] = useState([]);
  const {
    isOpen: isFollowersFollowingModalOpen,
    onOpen: onFollowersFollowingModalOpen,
    onClose: onFollowersFollowingModalClose
  } = useDisclosure();

  const { isFollowing, handleFollowUser, isUpdating } = useFollowUser(userProfile?.uid);

  const openFollowersFollowingModal = async (title, userIds) => {
    if (!userProfile || (authUser.username !== userProfile.username)) return;

    const fetchedUsernames = await Promise.all(
      userIds.map(async (uid) => {
        const userRef = doc(firestore, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          return { uid, username: userSnap.data().username };
        } else {
          return { uid, username: "Unknown" };
        }
      })
    );

    setModalTitle(title);
    setModalUsers(fetchedUsernames);
    onFollowersFollowingModalOpen();
  };

  const handleRemoveFollower = async (uid) => {
    if (!userProfile) return;

    try {
      const userRef = doc(firestore, "users", authUser.uid);
      await updateDoc(userRef, {
        followers: arrayRemove(uid)
      });

      // Optionally: remove the current user from the follower's list
      const followerRef = doc(firestore, "users", uid);
      await updateDoc(followerRef, {
        following: arrayRemove(authUser.uid)
      });

      // Update local state
      const updatedFollowers = userProfile.followers.filter(followerUid => followerUid !== uid);
      useUserProfileStore.getState().setUserProfile({ ...userProfile, followers: updatedFollowers });

      // Optionally: Show a toast or notification
    } catch (error) {
      console.error("Error removing follower:", error);
    }
  };

  const visitingOwnProfileAndAuth = authUser && authUser.username === userProfile?.username;
  const visitingAnotherProfileAndAuth = authUser && authUser.username !== userProfile?.username;

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
              Log Out
            </Button>
          </Flex>
        </Flex>
      </Box>

      <AvatarGroup size={{ base: "xl", md: "2xl" }} justifySelf="center" alignSelf="flex-start" mx="auto">
        <Avatar src={userProfile?.profilePicURL} alt="" />
      </AvatarGroup>

      <VStack alignItems="start" gap={2} mx="auto" flex={1}>
        <Flex
          gap={4}
          direction={{ base: "column", sm: "row" }}
          justifyContent={{ base: "center", sm: "flex-start" }}
          alignItems="center"
          w="full"
        >
          <Text fontSize={{ base: "sm", md: "lg" }}>{userProfile?.username}</Text>
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
          <Text
            fontSize={{ base: "xs", md: "sm" }}
            cursor={visitingOwnProfileAndAuth ? "pointer" : "not-allowed"}
            onClick={() => {
              if (visitingOwnProfileAndAuth) {
                openFollowersFollowingModal('Followers', userProfile?.followers || []);
              }
            }}
          >
            <Text as="span" fontWeight="bold" mr={1}>
              {userProfile?.followers?.length || 0}
            </Text>
            Followers
          </Text>
          <Text
            fontSize={{ base: "xs", md: "sm" }}
            cursor={visitingOwnProfileAndAuth ? "pointer" : "not-allowed"}
            onClick={() => {
              if (visitingOwnProfileAndAuth) {
                openFollowersFollowingModal('Following', userProfile?.following || []);
              }
            }}
          >
            <Text as="span" fontWeight="bold" mr={1}>
              {userProfile?.following?.length || 0}
            </Text>
            Following
          </Text>
        </Flex>
        <Flex alignItems="center" gap={4}>
          <Text fontSize="sm" fontWeight="bold">
            {userProfile?.fullName}
          </Text>
        </Flex>
        <Text fontSize="sm">Batch : {userProfile?.Batch || "Yet to Update"}</Text>
        <Text fontSize="sm">Bio : {userProfile?.bio || "Yet to Update"}</Text>
      </VStack>

      {isOpen && <EditProfile isOpen={isOpen} onClose={onClose} />}
      <FollowersFollowingModal
        isOpen={isFollowersFollowingModalOpen}
        onClose={onFollowersFollowingModalClose}
        title={modalTitle}
        users={modalUsers}
        onRemoveFollower={handleRemoveFollower}
      />
    </Flex>
  );
};

export default ProfileHeader;
