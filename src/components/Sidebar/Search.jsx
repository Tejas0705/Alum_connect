import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Tooltip,
	useDisclosure,
	Text,
	useMediaQuery,
  } from "@chakra-ui/react";
  import { SearchLogo } from "../../assets/constants";
  import useSearchUser from "../../hooks/useSearchUser";
  import { useRef, useState } from "react";
  import SuggestedUser from "../SuggestedUsers/SuggestedUser";
  import { debounce } from "lodash";
  
  const Search = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const searchRef = useRef(null);
	const [suggestionsVisible, setSuggestionsVisible] = useState(false);
	const { user, isLoading, getUserProfile, setUser, suggestions, fetchSuggestions } = useSearchUser();
  
	const debouncedSearch = useRef(
	  debounce((value) => {
		fetchSuggestions(value);
	  }, 500)
	).current;
  
	const handleSearchUser = (e) => {
	  e.preventDefault();
	  getUserProfile(searchRef.current.value);
	  setSuggestionsVisible(false);
	};
  
	const handleInputChange = (e) => {
	  const value = e.target.value;
	  debouncedSearch(value);
	  setSuggestionsVisible(true); // Ensure suggestions are visible when input changes
	};
  
	// Determine modal content width based on screen size
	const [isLargerThanMD] = useMediaQuery("(min-width: 48em)");
  
	return (
	  <>
		<Tooltip
		  hasArrow
		  label={"Search"}
		  placement="right"
		  ml={1}
		  openDelay={500}
		  display={{ base: "block", md: "none" }}
		>
		  <Flex
			alignItems={"center"}
			gap={4}
			_hover={{ bg: "whiteAlpha.400" }}
			borderRadius={6}
			p={2}
			w={{ base: 10, md: "full" }}
			justifyContent={{ base: "center", md: "flex-start" }}
			onClick={onOpen}
		  >
			<SearchLogo />
			<Box display={{ base: "none", md: "block" }}>Search</Box>
		  </Flex>
		</Tooltip>
  
		<Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInLeft">
		  <ModalOverlay />
		  <ModalContent bg={"black"} border={"1px solid gray"} maxW={isLargerThanMD ? "400px" : "270px"}>
			<ModalHeader>Search user</ModalHeader>
			<ModalCloseButton />
			<ModalBody pb={6}>
			  <form onSubmit={handleSearchUser}>
				<FormControl>
				  <FormLabel>Username</FormLabel>
				  <Input
					placeholder="Enter username"
					ref={searchRef}
					onChange={handleInputChange}
					autoFocus
				  />
				</FormControl>
  
				<Flex w={"full"} justifyContent={"flex-end"}>
				  <Button type="submit" ml={"auto"} size={"sm"} my={4} isLoading={isLoading}>
					Search
				  </Button>
				</Flex>
			  </form>
			  {suggestionsVisible && suggestions && suggestions.length > 0 && (
				<Box mt={4}>
				  <Text fontWeight="bold" pb={5}>Suggestions:</Text>
				  {suggestions.map((suggestion) => (
					<SuggestedUser key={suggestion.id} user={suggestion} setUser={setUser} />
				  ))}
				</Box>
			  )}
			  {user && !suggestionsVisible && <SuggestedUser user={user} setUser={setUser} />}
			</ModalBody>
		  </ModalContent>
		</Modal>
	  </>
	);
  };
  
  export default Search;
  