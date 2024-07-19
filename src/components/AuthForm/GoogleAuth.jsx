import { useEffect, useState } from "react";
import { Flex, Image, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Input, useDisclosure } from "@chakra-ui/react";
import { auth, firestore } from "../../firebase/firebase";
import useShowToast from "../../hooks/useShowToast";
import useAuthStore from "../../store/authStore";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "firebase/auth";

const GoogleAuth = ({ prefix }) => {
  const showToast = useShowToast();
  const loginUser = useAuthStore((state) => state.login);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [usn, setUsn] = useState("");
  const [newUser, setNewUser] = useState(null);

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const user = result.user;
          const userRef = doc(firestore, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userDoc = userSnap.data();
            if (!userDoc.usn) {
              setNewUser(user);
              onOpen();
            } else {
              localStorage.setItem("user-info", JSON.stringify(userDoc));
              loginUser(userDoc);
            }
          } else {
            setNewUser(user);
            onOpen();
          }
        }
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };

    handleRedirectResult();
  }, [auth, firestore, loginUser, onOpen, showToast]);

  const handleGoogleAuth = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };

  const handleUsnSubmit = async () => {
    if (!usn) {
      showToast("Error", "USN number is required", "error");
      return;
    }

    try {
      const userDoc = {
        uid: newUser.uid,
        email: newUser.email,
        username: newUser.email.split("@")[0],
        fullName: newUser.displayName,
        bio: "",
        profilePicURL: newUser.photoURL,
        usn: usn,
        followers: [],
        following: [],
        posts: [],
        createdAt: Date.now(),
      };
      await setDoc(doc(firestore, "users", newUser.uid), userDoc, { merge: true });
      localStorage.setItem("user-info", JSON.stringify(userDoc));
      loginUser(userDoc);
      onClose();
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  return (
    <>
      <Flex alignItems={"center"} justifyContent={"center"} cursor={"pointer"} onClick={handleGoogleAuth}>
        <Image src='/google.png' w={5} alt='Google logo' />
        <Text mx='2' color={"blue.500"}>
          {prefix} with Google
        </Text>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter Your USN Number</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="USN Number"
              value={usn}
              onChange={(e) => setUsn(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleUsnSubmit}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GoogleAuth;
