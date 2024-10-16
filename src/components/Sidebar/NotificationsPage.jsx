import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  List,
  ListItem,
  Avatar,
  Flex,
  Divider,
} from "@chakra-ui/react";
import { collection, query, where, onSnapshot, doc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import useAuthStore from "../../store/authStore";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [usernames, setUsernames] = useState({});
  const authUser = useAuthStore((state) => state.user?.uid);

  useEffect(() => {
    if (!authUser) return;

    const q = query(collection(firestore, "notifications"), where("receiverId", "==", authUser));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notificationsList = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        uid: doc.id,
      }));
      setNotifications(notificationsList);

      // Fetch sender usernames
      const senderIds = notificationsList.map((notification) => notification.senderId);
      senderIds.forEach((senderId) => {
        const userDocRef = doc(firestore, "users", senderId);
        onSnapshot(userDocRef, (userDoc) => {
          setUsernames((prevUsernames) => ({
            ...prevUsernames,
            [senderId]: userDoc.data()?.username || "Unknown User",
          }));
        });
      });
    });

    return () => unsubscribe();
  }, [authUser]);

  return (
    <Box maxW="600px" mx="auto" mt={8} p={4} bg="black" shadow="md" borderRadius="md">
      <Text fontSize="2xl" fontWeight="bold" mb={4} color="white">
        Notifications
      </Text>
      <List spacing={3}>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <ListItem
              key={notification.uid}
              p={3}
              bg="blue.50"
              borderRadius="md"
            >
              <Flex align="center">
                <Avatar name={usernames[notification.senderId]} size="sm" mr={3} />
                <Box flex="1">
                  <Text fontWeight="bold" color="black">
                    {/* Show the username of the person who sent the notification */}
                    {usernames[notification.senderId]}{" "}
                  </Text>
                  <Text fontSize="sm" color={"blue"}>
                    {notification.type === "follow" ? "has followed you." : "sent you a message."}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {new Date(notification.timestamp.seconds * 1000).toLocaleString()}
                  </Text>
                </Box>
              </Flex>
              <Divider mt={2} />
            </ListItem>
          ))
        ) : (
          <Text color="white">No notifications available.</Text>
        )}
      </List>
    </Box>
  );
};

export default NotificationsPage;
