// hooks/useLogin.js
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import useShowToast from "./useShowToast";
import { auth } from "../firebase/firebase"; // Firestore is not needed here
import useAuthStore from "../store/authStore";
import useFetchUserDoc from "./useFetchUserDoc"; // Import the new hook

const useLogin = () => {
	const showToast = useShowToast();
	const [signInWithEmailAndPassword, , loading, error] = useSignInWithEmailAndPassword(auth);
	const loginUser = useAuthStore((state) => state.login);

	const login = async (inputs) => {
		if (!inputs.email || !inputs.password) {
			return showToast("Error", "Please fill all the fields", "error");
		}
		try {
			const userCred = await signInWithEmailAndPassword(inputs.email, inputs.password);

			if (userCred) {
				const userId = userCred.user.uid;
				const { userDoc, loading: docLoading, error: docError } = useFetchUserDoc(userId);

				// Handle loading and error states
				if (docLoading) {
					return; // Optionally show a loading state
				}

				if (docError) {
					return showToast("Error", docError, "error");
				}

				localStorage.setItem("user-info", JSON.stringify(userDoc));
				loginUser(userDoc);
			}
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	return { loading, error, login };
};

export default useLogin;
