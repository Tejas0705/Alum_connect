import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Button, Input, InputGroup, InputRightElement, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSignUpWithEmailAndPassword from "../../hooks/useSignUpWithEmailAndPassword";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getAuth, sendEmailVerification } from "firebase/auth";

const Signup = () => {
  const [inputs, setInputs] = useState({
    usn: "",
    fullName: "",
    username: "",
    email: "",
    password: "",
    Batch: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error, signup } = useSignUpWithEmailAndPassword();
  const toast = useToast();
  const navigate = useNavigate();

  const verifyUsnAndEmail = async (usn, email) => {
    const firestore = getFirestore();
    const usnEmailRef = doc(firestore, "usnEmails", usn);
  
    try {
      const usnEmailSnap = await getDoc(usnEmailRef);
  
      if (!usnEmailSnap.exists()) {
        toast({
          title: "Invalid USN number. Please contact your administrator.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return false;
      }
  
      const storedEmail = usnEmailSnap.data().email;
  
      if (storedEmail !== email) {
        toast({
          title: "Email does not match the registered USN. Please check your credentials.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return false;
      }
  
      return true;
  
    } catch (error) {
      console.error("Error verifying USN and Email:", error);
      toast({
        title: "An error occurred while verifying your credentials. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
  };

  const handleSignup = async () => {
    // Basic email format validation
    if (!validateEmail(inputs.email)) {
      toast({
        title: "Invalid email format.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Verify USN and email before signup
    const isValid = await verifyUsnAndEmail(inputs.usn, inputs.email);
    if (!isValid) {
      return;
    }

    // Call signup
    const userCredential = await signup(inputs);

    // If signup is successful, send verification email
    if (userCredential) {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        await sendEmailVerification(currentUser);
        toast({
          title: "Verification email sent. Please check your email.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }

      // Navigate to home or other page after signup
      navigate("/");
    }
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  return (
    <>
      <Input
        placeholder='USN Number'
        fontSize={14}
        type='text'
        size={"sm"}
        value={inputs.usn}
        onChange={(e) => setInputs({ ...inputs, usn: e.target.value })}
      />
      <Input
        placeholder='Email'
        fontSize={14}
        type='email'
        size={"sm"}
        value={inputs.email}
        onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
      />
      <Input
        placeholder='Username'
        fontSize={14}
        type='text'
        size={"sm"}
        value={inputs.username}
        onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
      />
      <Input
        placeholder='Full Name'
        fontSize={14}
        type='text'
        size={"sm"}
        value={inputs.fullName}
        onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
      />
      <Input
        placeholder='Batch'
        fontSize={14}
        type='text'
        size={"sm"}
        value={inputs.Batch}
        onChange={(e) => setInputs({ ...inputs, Batch: e.target.value })}
      />
      <InputGroup>
        <Input
          placeholder='Password'
          fontSize={14}
          type={showPassword ? "text" : "password"}
          value={inputs.password}
          size={"sm"}
          onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
        />
        <InputRightElement h='full'>
          <Button variant={"ghost"} size={"sm"} onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <ViewIcon /> : <ViewOffIcon />}
          </Button>
        </InputRightElement>
      </InputGroup>

      {error && (
        toast({
          title: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        })
      )}

      <Button
        w={"full"}
        colorScheme='blue'
        size={"sm"}
        fontSize={14}
        isLoading={loading}
        onClick={handleSignup}
      >
        Sign Up
      </Button>
    </>
  );
};

export default Signup;