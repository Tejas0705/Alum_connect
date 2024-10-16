// sendNotification.js
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase"; // Adjust the import path

const SendNotification = async (senderId, receiverId, message) => {
  try {
    const notificationId = `${senderId}`; // Unique ID for the notification
    await setDoc(doc(firestore, "notifications", notificationId), {
      senderId,
      receiverId,
      message,
      type: "follow", // Type of notification
      read: false,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Error sending notification: ", error);
  }
};

export default SendNotification;
