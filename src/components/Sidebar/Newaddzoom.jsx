import { Box, Link, Tooltip } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { TbBrandZoom } from "react-icons/tb";


const Home = () => {
	return (
		<Tooltip
			hasArrow
			label={"AddZoomLinks"}
			placement='right'
			ml={1}
			openDelay={500}
			display={{ base: "block", md: "none" }}
		>
			<Link
				display={"flex"}
				to={"/Addzoomlink"}
				as={RouterLink}
				alignItems={"center"}
				gap={4}
				_hover={{ bg: "whiteAlpha.400" }}
				borderRadius={6}
				p={2}
				w={{ base: 10, md: "full" }}
				justifyContent={{ base: "center", md: "flex-start" }}
			>
				<TbBrandZoom size={25} />
				<Box display={{ base: "none", md: "block" }}>AddzoomLinks</Box>
			</Link>
		</Tooltip>
	);
};

export default Home;