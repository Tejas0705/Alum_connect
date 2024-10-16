import { useEffect, useState } from "react";
import useShowToast from "./useShowToast";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useGetUserProfileById = (userId) => {
	const [isLoading, setIsLoading] = useState(true);
	const [userProfile, setUserProfile] = useState(null);
	const showToast = useShowToast();

	useEffect(() => {
		const getUserProfile = async () => {
			setIsLoading(true);
			try {
				const userRef = doc(firestore, "users", userId);
				const userSnap = await getDoc(userRef);
				if (userSnap.exists()) {
					setUserProfile(userSnap.data());
				}
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setIsLoading(false);
			}
		};

		if (userId) {
			getUserProfile();
		}
	}, [userId, showToast]);

	return { isLoading, userProfile };
};

export default useGetUserProfileById;
