import { POSTS_PER_PAGE } from "@/consts";
import { usePublicPosts } from "@/Hooks/usePublicPosts";
import { useState } from "react";
import PostCard from "./PostCard";
import { Loader } from "lucide-react";
import Pagination from "./Pagination";

const PublicPostsFeed = () => {
  const [page, setPage] = useState<number>(1);
  const {
    posts,
    isLoading: isPostsLoading,
    noOfPages,
  } = usePublicPosts(page, POSTS_PER_PAGE);

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

        {noOfPages > 1 && (
          <Pagination
            setPage={setPage}
            currentPage={page}
            noOfPages={noOfPages}
          />
        )}
      </div>
    </>
  );
};

export default PublicPostsFeed;
