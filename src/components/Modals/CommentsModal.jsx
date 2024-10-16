import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import Comment from "../Comment/Comment";
import usePostComment from "../../hooks/usePostComment";

const CommentsModal = ({ isOpen, onClose, post }) => {
  const { handlePostComment, isCommenting, fetchComments } = usePostComment();
  const commentInputRef = useRef(null);
  const commentsContainerRef = useRef(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (post && post.id) {
      fetchComments(post.id).then((fetchedComments) => {
        setComments(fetchedComments);
      });
    }
  }, [post]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    const commentText = commentInputRef.current.value.trim();
    if (!commentText) return;

    const newComment = await handlePostComment(post.id, commentText);
    if (newComment) {
      setComments((prevComments) => [...prevComments, newComment]);
      commentInputRef.current.value = "";
    }
  };

  useEffect(() => {
    const scrollToBottom = () => {
      if (commentsContainerRef.current) {
        commentsContainerRef.current.scrollTop = commentsContainerRef.current.scrollHeight;
      }
    };

    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [isOpen, comments]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInLeft">
      <ModalOverlay />
      <ModalContent bg="black" border="1px solid gray" maxW="400px">
        <ModalHeader>Comments</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Flex
            mb={4}
            gap={4}
            flexDir="column"
            maxH="250px"
            overflowY="auto"
            ref={commentsContainerRef}
          >
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <Comment key={index} comment={comment} />
              ))
            ) : (
              <Text color="gray.500">No comments yet. Be the first to comment!</Text>
            )}
          </Flex>
          <form onSubmit={handleSubmitComment} style={{ marginTop: "2rem" }}>
            <Input placeholder="Add a comment..." size="sm" ref={commentInputRef} />
            <Flex w="full" justifyContent="flex-end">
              <Button
                type="submit"
                ml="auto"
                size="sm"
                my={4}
                isLoading={isCommenting}
                loadingText="Posting..."
              >
                Post
              </Button>
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CommentsModal;
