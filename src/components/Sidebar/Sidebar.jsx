import { Box, Button, Flex, Link, Tooltip } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import useLogout from "../../hooks/useLogout";
import SidebarItems from "./SidebarItems";

const Sidebar = () => {
  const { handleLogout, isLoggingOut } = useLogout();

  return (
    <>
      {/* Desktop Sidebar */}
      <Box
        display={{ base: "none", md: "block" }}
        height="100vh"
        borderRight="1px solid"
        borderColor="whiteAlpha.300"
        py={8}
        position="sticky"
        top={0}
        left={0}
        px={{ base: 2, md: 4 }}
      >
        <Flex direction="column" gap={10} w="full" height="full">
          {/* Logo only in desktop view */}
          <Link to="/" as={RouterLink} pl={2} display={{ base: "none", md: "block" }} cursor="pointer">
            <img src="/logo-white.png" alt="logo" />
          </Link>
          <Flex direction="column" gap={5} cursor="pointer">
            <SidebarItems />
          </Flex>
          <Tooltip
            hasArrow
            label="Logout"
            placement="right"
            ml={1}
            openDelay={500}
            display={{ base: "none", md: "block" }}
          >
            <Flex
              onClick={handleLogout}
              alignItems="center"
              gap={4}
              _hover={{ bg: "whiteAlpha.400" }}
              borderRadius={6}
              p={2}
              w="full"
              mt="auto"
              justifyContent="flex-start"
            >
              <BiLogOut size={25} />
              <Button
                display={{ base: "none", md: "block" }}
                variant="ghost"
                _hover={{ bg: "transparent" }}
                isLoading={isLoggingOut}
              >
                Logout
              </Button>
            </Flex>
          </Tooltip>
        </Flex>
      </Box>

      {/* Mobile Sidebar */}
      <Box
        display={{ base: "flex", md: "none" }}
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        height="60px"
        bg="gray.900"
        borderTop="1px solid"
        borderColor="whiteAlpha.300"
        justifyContent="space-around"
        alignItems="center"
        zIndex={10}
      >
        <SidebarItems isMobile />
      </Box>
    </>
  );
};

export default Sidebar;
