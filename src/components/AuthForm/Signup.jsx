import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Button, Input, InputGroup, InputRightElement, useToast } from "@chakra-ui/react";
import { useState } from "react";
import useSignUpWithEmailAndPassword from "../../hooks/useSignUpWithEmailAndPassword";
import { firestore } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

const Signup = () => {
  const [inputs, setInputs] = useState({
    usn: "",
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error, signup } = useSignUpWithEmailAndPassword();
  const toast = useToast();

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

    const usnRef = doc(firestore, "usnNumbers", inputs.usn);
    const usnSnap = await getDoc(usnRef);

    if (!usnSnap.exists()) {
      toast({
        title: "Invalid USN number. Please contact your administrator.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    signup(inputs);
  };

  const validateEmail = (email) => {
    // Basic email format validation
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
        onChange={(e) => {
          setInputs({ ...inputs, email: e.target.value });
        }}
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
