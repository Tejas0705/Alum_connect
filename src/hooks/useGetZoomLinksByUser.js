import { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';

const useGetZoomLinksByUser = () => {
  const [zoomLinks, setZoomLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchZoomLinks = async () => {
      try {
        const zoomLinksCollection = collection(firestore, 'zoomLinks');
        const querySnapshot = await getDocs(zoomLinksCollection);

        const zoomLinksWithUserDetails = await Promise.all(
          querySnapshot.docs.map(async (zoomLinkDoc) => {
            const zoomLinkData = zoomLinkDoc.data();
            const userDocRef = doc(firestore, 'users', zoomLinkData.createdBy);
            const userDoc = await getDoc(userDocRef);
            const userData = userDoc.data();
            return {
              id: zoomLinkDoc.id,
              ...zoomLinkData,
              creatorUsername: userData?.username || 'Unknown',
              creatorProfilePic: userData?.profilePicURL || '',
            };
          })
        );

        setZoomLinks(zoomLinksWithUserDetails);
      } catch (error) {
        console.error('Error fetching Zoom links:', error);
        setError('Failed to fetch Zoom links');
      } finally {
        setLoading(false);
      }
    };

    fetchZoomLinks();
  }, []);

  return { zoomLinks, loading, error };
};

export default useGetZoomLinksByUser;
