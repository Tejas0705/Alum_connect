// utils/fetchUserDoc.js
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase"; // Adjust the path as necessary

const fetchUserDoc = async (uid) => {
  const docRef = doc(firestore, "users", uid); // Adjust "users" if your collection name is different
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data(); // Return the user document data
  } else {
    throw new Error("No such user document!"); // Handle the case where the user document doesn't exist
  }
};

export default fetchUserDoc;
