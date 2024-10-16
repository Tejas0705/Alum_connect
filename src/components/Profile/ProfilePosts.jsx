import { Grid, Skeleton, Text } from "@chakra-ui/react";
import ProfilePost from "./ProfilePost";
import useGetUserPosts from "../../hooks/useGetUserPosts";

const ProfilePosts = () => {
    const { isLoading, posts } = useGetUserPosts();

    if (isLoading) {
        return (
            <Grid
                templateColumns={{ base: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
                gap={4}
                px={[2, 4]} // Adjust padding for smaller screens
            >
                {[...Array(6)].map((_, idx) => (
                    <Skeleton key={idx} height={["250px", "300px"]} borderRadius="md" />
                ))}
            </Grid>
        );
    }

    if (posts.length === 0) {
        return <Text>No posts available.</Text>;
    }

    return (
        <Grid
            templateColumns={{ base: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
            gap={4}
            px={[2, 4]} // Adjust padding for smaller screens
        >
            {posts.map((post) => (
                <ProfilePost key={post.id} post={post} />
            ))}
        </Grid>
    );
};

export default ProfilePosts;
