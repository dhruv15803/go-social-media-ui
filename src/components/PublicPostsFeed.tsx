import { POSTS_PER_PAGE } from "@/consts";
import { usePublicPosts } from "@/Hooks/usePublicPosts";
import { useState } from "react";
import PostCard from "./PostCard";
import { Loader } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { Button } from "./ui/button";

const PublicPostsFeed = () => {
  const [page, setPage] = useState<number>(1);
  const {
    posts,
    isLoading: isPostsLoading,
    noOfPages,
  } = usePublicPosts(page, POSTS_PER_PAGE);
  const { inView } = useInView();

  if (isPostsLoading) {
    return (
      <>
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-2 my-2">
        <div className="flex flex-col gap-4">
          {posts !== null &&
            posts.length !== 0 &&
            posts.map((post) => {
              return <PostCard key={post.id} post={post} />;
            })}
        </div>

        {(posts === null || posts.length === 0) && (
          <>
            <div className="flex items-center justify-center mt-24 font-semibold text-xl">
              No posts
            </div>
          </>
        )}

        {noOfPages > 1 && inView && page !== noOfPages && (
          <div className="flex items-center justify-center">
            <Button
              onClick={() => setPage((prevPage) => prevPage + 1)}
              className="bg-teal-500 text-white hover:bg-teal-600 hover:duration-300"
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default PublicPostsFeed;
