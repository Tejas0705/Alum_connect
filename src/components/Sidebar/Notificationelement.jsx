import { Box, Link, Tooltip, Badge } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { RiNotificationLine } from "react-icons/ri";

const NotificationElement = ({ unreadCount }) => {
  return (
    <Tooltip
      hasArrow
      label={"Notifications"}
      placement="right"
      ml={1}
      openDelay={500}
      display={{ base: "block", md: "none" }}
    >
      <Link
        display={"flex"}
        to={"/notifications"} // Update the route as needed
        as={RouterLink}
        alignItems={"center"}
        gap={4}
        _hover={{ bg: "whiteAlpha.400" }}
        borderRadius={6}
        p={2}
        w={{ base: 10, md: "full" }}
        justifyContent={{ base: "center", md: "flex-start" }}
        aria-label="Notifications" // Accessibility improvement
        position="relative"
      >
        <RiNotificationLine size={25} />
        {unreadCount > 0 && (
          <Badge
            colorScheme="red"
            borderRadius="full"
            position="absolute"
            top={0}
            right={0}
            width={3}
            height={3}
            fontSize="xs"
          />
        )}
        <Box display={{ base: "none", md: "block" }}>Notifications</Box>
      </Link>
    </Tooltip>
  );
};

export default NotificationElement;
