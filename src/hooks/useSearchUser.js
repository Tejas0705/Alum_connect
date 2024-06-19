import { useState } from "react";
import useShowToast from "./useShowToast";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useSearchUser = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [user, setUser] = useState(null);
	const [suggestions, setSuggestions] = useState([]); // Initialize suggestions state
	const showToast = useShowToast();

	const getUserProfile = async (username) => {
		setIsLoading(true);
		setUser(null);
		try {
			const q = query(collection(firestore, "users"), where("username", "==", username));
			const querySnapshot = await getDocs(q);

			if (querySnapshot.empty) {
				showToast("Error", "User not found", "error");
				setSuggestions([]); // Clear suggestions when user not found
				return;
			}

			const userData = querySnapshot.docs.map((doc) => doc.data());
			setUser(userData[0]); // Assuming username is unique, set the first user found
		} catch (error) {
			showToast("Error", error.message, "error");
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	};

	const fetchSuggestions = async (partialUsername) => {
		try {
			if (!partialUsername.trim()) {
				setSuggestions([]);
				return;
			}

			const q = query(
				collection(firestore, "users"),
				where("username", ">=", partialUsername),
				limit(5)
			);

			const querySnapshot = await getDocs(q);
			const suggestionsArray = querySnapshot.docs.map((doc) => doc.data());
			setSuggestions(suggestionsArray);
		} catch (error) {
			console.error("Error fetching suggestions:", error);
			setSuggestions([]);
		}
	};

	return { isLoading, getUserProfile, user, setUser, suggestions, fetchSuggestions };
};

export default useSearchUser;
