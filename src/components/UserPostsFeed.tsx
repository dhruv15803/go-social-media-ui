import { POSTS_PER_PAGE } from "@/consts";
import { usePostsFeed } from "@/Hooks/usePostsFeed";
import { Loader } from "lucide-react";
import { useState, type SetStateAction } from "react";
import PostCard from "./PostCard";
import axios from "axios";
import { API_URL } from "@/App";
import { useInView } from "react-intersection-observer";
import { Button } from "./ui/button";

type Props = {
  refetchPostsFlag: boolean;
  setRefetchPostsFlag: React.Dispatch<SetStateAction<boolean>>;
};

const UserPostsFeed = ({ refetchPostsFlag, setRefetchPostsFlag }: Props) => {
  const { ref, inView } = useInView();
  const [page, setPage] = useState<number>(1);
  const {
    posts,
    noOfPages,
    isLoading: isPostsLoading,
  } = usePostsFeed(page, POSTS_PER_PAGE, refetchPostsFlag);

  const handleDeletePostById = async (postId: number) => {
    try {
      await axios.delete(`${API_URL}/api/post/${postId}`, {
        withCredentials: true,
      });
      setRefetchPostsFlag((prev) => !prev);
    } catch (error) {
      console.log(error);
    }
  };

  if (isPostsLoading) {
    return (
      <>
        <div className="flex items-center justify-center mt-24">
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
            posts.map((post, idx) => {
              return (
                <div key={post.id} ref={idx === posts.length - 1 ? ref : null}>
                  <PostCard
                    key={post.id}
                    post={post}
                    onDeletePost={handleDeletePostById}
                  />
                </div>
              );
            })}

          {(posts === null || posts.length === 0) && (
            <>
              <div className="flex items-center justify-center mt-12 font-semibold text-xl">
                No activity
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
      </div>
    </>
  );
};

export default UserPostsFeed;
