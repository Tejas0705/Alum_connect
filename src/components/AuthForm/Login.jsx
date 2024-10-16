import { Button, Input, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"; // Import sign-in function
import useAuthStore from "../../store/authStore"; // Adjust the path as necessary
import fetchUserDoc from "../../utils/fetchUserDoc"; // Import the fetchUserDoc function
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const loginUser = useAuthStore((state) => state.login);
  const handleLogin = async () => {
    setLoading(true);
    const auth = getAuth();
	
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if the email is verified
      if (user.emailVerified) {
        const userDoc = await fetchUserDoc(user.uid); // Fetch the user document
        loginUser(userDoc); // Call your loginUser function
        toast({
          title: "Logged in successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        await auth.signOut(); // Sign out the user if the email is not verified
		
        toast({
          title: "Please verify your email before logging in.",
          status: "error",
          duration: 5000,
          isClosable: false,
		  
        });
		
      }
    } catch (error) {
      toast({
        title: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
	  
    }
  };

  return (
    <>
      <Input
        placeholder='Email'
        type='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        placeholder='Password'
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        colorScheme='blue'
        onClick={handleLogin}
        isLoading={loading}
      >
        Log In
      </Button>
    </>
  );
};

export default Login;
