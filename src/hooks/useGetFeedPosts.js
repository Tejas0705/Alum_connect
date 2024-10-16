import { useEffect, useState } from "react";
import usePostStore from "../store/postStore";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import { collection, getDocs, query, where, onSnapshot, doc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useGetFeedPosts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { posts, setPosts } = usePostStore();
  const authUser = useAuthStore((state) => state.user);
  const showToast = useShowToast();

  const fetchPosts = async () => {
    setIsLoading(true);

    if (!authUser || !authUser.following || authUser.following.length === 0) {
      setPosts([]);
      setIsLoading(false);
      return;
    }

    // Ensure that the query only fetches posts from users in the following list
    const q = query(collection(firestore, "posts"), where("createdBy", "in", authUser.following));
    try {
      const querySnapshot = await getDocs(q);
      const feedPosts = [];

      querySnapshot.forEach((doc) => {
        feedPosts.push({ id: doc.id, ...doc.data() });
      });

      feedPosts.sort((a, b) => b.createdAt - a.createdAt);
      setPosts(feedPosts);
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authUser) {
      fetchPosts();
    }

    if (!authUser) {
      // Handle case when authUser is null
      return;
    }

    // Real-time listener for the user's following list
    const userDocRef = doc(firestore, "users", authUser.uid);
    const unsubscribe = onSnapshot(userDocRef, async (docSnapshot) => {
      const updatedUserData = docSnapshot.data();
      if (updatedUserData && JSON.stringify(updatedUserData.following) !== JSON.stringify(authUser.following)) {
        // Followings have changed, update posts
        await fetchPosts();
      }
    });

    return () => unsubscribe();

  }, [authUser, showToast, setPosts]);

  return { isLoading, posts };
};

export default useGetFeedPosts;
