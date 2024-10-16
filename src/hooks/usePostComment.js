import { useState } from "react";
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";
import { arrayUnion, doc, updateDoc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import usePostStore from "../store/postStore";

const usePostComment = () => {
  const [isCommenting, setIsCommenting] = useState(false);
  const showToast = useShowToast();
  const authUser = useAuthStore((state) => state.user);
  const addComment = usePostStore((state) => state.addComment);

  const handlePostComment = async (postId, comment) => {
    if (isCommenting) return;
    if (!authUser) {
      return showToast("Error", "You must be logged in to comment", "error");
    }
    setIsCommenting(true);

    const newComment = {
      text: comment,
      createdAt: Date.now(),
      createdBy: authUser.uid,
      username: authUser.username,
    };

    try {
      await updateDoc(doc(firestore, "posts", postId), {
        comments: arrayUnion(newComment),
      });
      addComment(postId, newComment);
      showToast("Success", "Comment posted successfully", "success");
      return newComment;
    } catch (error) {
      showToast("Error", error.message, "error");
      return null;
    } finally {
      setIsCommenting(false);
    }
  };

  const fetchComments = async (postId) => {
    const postRef = doc(firestore, "posts", postId);
    const postSnap = await getDoc(postRef);
    if (postSnap.exists()) {
      return postSnap.data().comments || [];
    }
    return [];
  };

  return { isCommenting, handlePostComment, fetchComments };
};

export default usePostComment;
