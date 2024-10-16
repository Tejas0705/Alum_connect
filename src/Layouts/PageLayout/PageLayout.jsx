import { Box, Flex, Spinner, useBreakpointValue } from "@chakra-ui/react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebase";
import Navbar from "../../components/Navbar/Navbar";

const PageLayout = ({ children }) => {
  const { pathname } = useLocation();
  const [user, loading] = useAuthState(auth);

  // Determine if sidebar and navbar should be rendered
  const canRenderSidebar = pathname !== "/auth" && user;
  const canRenderNavbar = !user && !loading && pathname !== "/auth";

  // Determine the breakpoint value for sidebar placement
  const sidebarPlacement = useBreakpointValue({ base: "bottom", md: "left" });

  // Show loading spinner if user authentication state is loading
  if (!user && loading) return <PageLayoutSpinner />;

  return (
    <Flex flexDir={{ base: "column", md: "row" }}>
      {/* Sidebar or Navbar based on breakpoint */}
      {sidebarPlacement === "bottom" ? (
        <>
          {/* Navbar */}
          {canRenderNavbar && <Navbar />}
          {/* Page content */}
          <Box flex={1} w="full" mx="auto">
            {children}
          </Box>
          {/* Sidebar */}
          {canRenderSidebar && (
            <Box w="full" pt={4}>
              <Sidebar />
            </Box>
          )}
        </>
      ) : (
        <>
          {/* Sidebar on the left */}
          {canRenderSidebar && (
            <Box w={{ base: "100%", md: "240px" }}>
              <Sidebar />
            </Box>
          )}

          {/* Navbar */}
          {canRenderNavbar && <Navbar />}

          {/* Page content on the right */}
          <Box flex={1} w={{ base: "calc(100% - 70px)", md: "calc(100% - 240px)" }} mx="auto">
            {children}
          </Box>
        </>
      )}
    </Flex>
  );
};

export default PageLayout;

const PageLayoutSpinner = () => (
  <Flex flexDir="column" h="100vh" alignItems="center" justifyContent="center">
    <Spinner size="xl" />
  </Flex>
);
