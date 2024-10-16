// hooks/useFetchUserDoc.js
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase"; // Adjust the path as necessary

const useFetchUserDoc = (userId) => {
  const [userDoc, setUserDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDoc = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(firestore, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserDoc(docSnap.data());
        } else {
          setError("No such user document!");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDoc();
  }, [userId]);

  return { userDoc, loading, error };
};

export default useFetchUserDoc;
