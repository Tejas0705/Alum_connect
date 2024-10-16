// useSendNotification.js
import { useCallback } from 'react';
import SendNotification from '../components/Sidebar/SendNotification'; // Adjust the import path

const useSendNotification = () => {
  const notify = useCallback(async (senderId, receiverId, message, type) => {
    try {
      await SendNotification(senderId, receiverId, message, type);
    } catch (error) {
      console.error("Error sending notification: ", error);
    }
  }, []);

  return { notify };
};

export default useSendNotification;
