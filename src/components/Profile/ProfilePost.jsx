import { Box, Flex, Text, useDisclosure, Image, Button, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, Avatar, Divider, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { AiFillHeart } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useState, useRef } from "react";
import { deleteObject, ref } from "firebase/storage";
import { firestore, storage } from "../../firebase/firebase";
import { arrayRemove, arrayUnion, deleteDoc, doc, updateDoc } from "firebase/firestore";
import usePostStore from "../../store/postStore";
import Caption from "../Comment/Caption";
import useShowToast from "../../hooks/useShowToast";
import useUserProfileStore from "../../store/userProfileStore";
import useAuthStore from "../../store/authStore";
import Comment from "../Comment/Comment";

const ProfilePost = ({ post }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const showToast = useShowToast();
    const [isDeleting, setIsDeleting] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [isPostingComment, setIsPostingComment] = useState(false);
    const deletePost = usePostStore((state) => state.deletePost);
    const decrementPostsCount = useUserProfileStore((state) => state.decrementPostsCount);
    const authUser = useAuthStore((state) => state.user);
    const userProfile = useUserProfileStore((state) => state.userProfile);
    const commentRef = useRef(null);

    const handleDeletePost = async () => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        if (isDeleting) return;

        try {
            const imageRef = ref(storage, `posts/${post.id}`);
            await deleteObject(imageRef);
            const userRef = doc(firestore, "users", authUser.uid);
            await deleteDoc(doc(firestore, "posts", post.id));

            await updateDoc(userRef, {
                posts: arrayRemove(post.id),
            });

            deletePost(post.id);
            decrementPostsCount();
            showToast("Success", "Post deleted successfully", "success");
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsDeleting(false);
            onClose();
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        setIsPostingComment(true);
        try {
            const postRef = doc(firestore, "posts", post.id);
            const comment = {
                id: Date.now().toString(),
                text: newComment,
                userId: authUser.uid,
                username: authUser.username,
                createdAt: new Date().toISOString(),
            };
            await updateDoc(postRef, {
                comments: arrayUnion(comment),
            });
            setNewComment("");
            showToast("Success", "Comment added successfully", "success");
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsPostingComment(false);
        }
    };

    return (
        <Box
            position="relative"
            overflow="hidden"
            borderRadius="md"
            borderWidth="1px"
            borderColor="gray.200"
            onClick={onOpen}
            cursor="pointer"
            flex={{ base: "1 0 100%", sm: "1 0 calc(50% - 8px)", md: "1 0 calc(33.33% - 8px)" }}
            maxWidth="200%"
            margin="4px"
        >
            <Box position="relative" overflow="hidden" borderRadius="md">
                <Image src={post.imageURL} alt="Profile Post" objectFit="cover" w="100%" h="300px" />
                <Flex
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    bottom="0"
                    align="center"
                    justify="center"
                    bg="rgba(0, 0, 0, 0.5)"
                    opacity={0}
                    _hover={{ opacity: 1 }}
                    transition="opacity 0.2s"
                >
                    <Flex align="center" justify="center" color="white">
                        <AiFillHeart size={20} />
                        <Text fontWeight="bold" ml={1}>
                            {post.likes.length}
                        </Text>
                    </Flex>
                    <Flex align="center" justify="center" color="white" ml={4}>
                        <FaComment size={20} />
                        <Text fontWeight="bold" ml={1}>
                            {post.comments.length}
                        </Text>
                    </Flex>
                </Flex>
            </Box>

            {/* Modal for detailed view */}
            <Modal isOpen={isOpen} onClose={onClose} isCentered size={{ base: "full", md: "5xl" }}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalBody bg="black" pb={5}>
                        <Flex
                            gap="4"
                            w="full"
                            maxW={{ base: "100%", sm: "90%", md: "80%", lg: "70%" }}
                            mx="auto"
                            maxH="90vh"
                            minH="50vh"
                            flexDirection={{ base: "column", sm: "row" }}
                        >
                            {/* Image Section */}
                            <Flex
                                borderRadius={4}
                                overflow="hidden"
                                border="1px solid"
                                borderColor="whiteAlpha.300"
                                flex={{ base: "1", sm: "1.5" }}
                                justifyContent="center"
                                alignItems="center"
                                mb={{ base: "4", sm: "0" }}
                            >
                                <Image src={post.imageURL} alt="Profile Post" />
                            </Flex>

                            {/* Details Section */}
                            <Flex flex={{ base: "1", sm: "1" }} flexDir="column" px={10} >
                                {/* User Info */}
                                <Flex alignItems="center" justifyContent="space-between" mb={4}>
                                    <Flex alignItems="center" gap={4}>
                                        <Avatar src={userProfile?.profilePicURL} size="sm" name={userProfile?.username} />
                                        <Text fontWeight="bold" fontSize={12}>
                                            {userProfile?.username}
                                        </Text>
                                    </Flex>
                                    {authUser?.uid === userProfile?.uid && (
                                        <Button
                                            size="sm"
                                            bg="transparent"
                                            _hover={{ bg: "whiteAlpha.300", color: "red.600" }}
                                            borderRadius={4}
                                            p={1}
                                            onClick={handleDeletePost}
                                            isLoading={isDeleting}
                                        >
                                            <MdDelete size={20} cursor="pointer" />
                                        </Button>
                                    )}
                                </Flex>
                                <Divider mb={4} bg="gray.500" />

                                {/* Caption */}
                                <Box mb={4}>
                                    <Caption post={post} />
                                </Box>

                                {/* Comments */}
                                <Box overflowY="auto" mb={4}>
                                    <Text fontSize="sm" fontWeight="bold" mb={2}>
                                        Comments
                                    </Text>
                                    {post.comments.map((comment) => (
                                        <Comment key={comment.id} comment={comment} />
                                    ))}
                                    {post.comments.length === 0 && (
                                        <Text fontSize="sm" fontStyle="italic" color="gray.500">
                                            No comments yet
                                        </Text>
                                    )}
                                </Box>
                               
                                {/* Add Comment */}
                                {authUser && (
                                    <Flex alignItems="center" gap={2}>
                                        <InputGroup>
                                            <Input
                                                variant="flushed"
                                                placeholder="Add a comment..."
                                                fontSize={14}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                value={newComment}
                                                ref={commentRef}
                                            />
                                            <InputRightElement>
                                                <Button
                                                    fontSize={14}
                                                    color="blue.500"
                                                    fontWeight={600}
                                                    cursor="pointer"
                                                    _hover={{ color: "white" }}
                                                    bg="transparent"
                                                    onClick={handleAddComment}
                                                    isLoading={isPostingComment}
                                                >
                                                    Post
                                                </Button>
                                            </InputRightElement>
                                        </InputGroup>
                                    </Flex>
                                )}
                            </Flex>
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default ProfilePost;
