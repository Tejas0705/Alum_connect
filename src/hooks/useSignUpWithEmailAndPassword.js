import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firestore } from "../firebase/firebase";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import useShowToast from "./useShowToast";
import { getAuth, sendEmailVerification } from "firebase/auth"; // Import necessary Firebase methods

const useSignUpWithEmailAndPassword = () => {
  const [createUserWithEmailAndPassword, , loading, error] = useCreateUserWithEmailAndPassword(auth);
  const showToast = useShowToast();

  const signup = async (inputs) => {
    if (!inputs.email || !inputs.password || !inputs.username || !inputs.fullName || !inputs.Batch || !inputs.usn) {
      showToast("Error", "Please fill all the fields", "error");
      return;
    }

    // Basic password strength validation
    if (inputs.password.length < 6) {
      showToast("Error", "Password should be at least 6 characters long", "error");
      return;
    }

    const usersRef = collection(firestore, "users");

    try {
      // Check if username is already taken
      const q = query(usersRef, where("username", "==", inputs.username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        showToast("Error", "Username already exists", "error");
        return;
      }

      // Create user with email and password
      const newUser = await createUserWithEmailAndPassword(inputs.email, inputs.password);

      if (!newUser) {
        showToast("Error", "Failed to create user", "error");
        return;
      }

      // Create user document in Firestore
      const userDoc = {
        usn: inputs.usn,
        uid: newUser.user.uid,
        email: inputs.email,
        username: inputs.username,
        fullName: inputs.fullName,
        bio: "",
        Batch: inputs.Batch,
        profilePicURL: "",
        followers: [],
        following: [],
        posts: [],
        createdAt: Date.now(),
      };

      await setDoc(doc(firestore, "users", newUser.user.uid), userDoc);

      // Store user info in local storage
      localStorage.setItem("user-info", JSON.stringify(userDoc));

      showToast("Success", "User created successfully", "success");

      // Send email verification using the authenticated user
      const auth = getAuth(); // Get the current auth instance
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser); // Send email verification
        showToast("Success", "Verification email sent. Please check your email.", "success");
      }

      return newUser; // Return the new user credential for further actions

    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        showToast("Error", "Email already in use", "error");
      } else if (error.code === "auth/weak-password") {
        showToast("Error", "Password is too weak", "error");
      } else {
        showToast("Error", error.message, "error");
      }
    }
  };

  return { loading, error, signup };
};

export default useSignUpWithEmailAndPassword;
