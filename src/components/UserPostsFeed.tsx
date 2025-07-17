import { POSTS_PER_PAGE } from "@/consts";
import { usePostsFeed } from "@/Hooks/usePostsFeed";
import { Loader } from "lucide-react";
import { useState, type SetStateAction } from "react";
import PostCard from "./PostCard";
import axios from "axios";
import { API_URL } from "@/App";
import Pagination from "./Pagination";

type Props = {
  refetchPostsFlag: boolean;
  setRefetchPostsFlag: React.Dispatch<SetStateAction<boolean>>;
};

const UserPostsFeed = ({ refetchPostsFlag, setRefetchPostsFlag }: Props) => {
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
            posts.map((post) => {
              return (
                <PostCard
                  key={post.id}
                  post={post}
                  onDeletePost={handleDeletePostById}
                />
              );
            })}

          {(posts === null || posts.length === 0) && (
            <>
              <div className="flex items-center justify-center mt-12 font-semibold text-xl">
                No activity
              </div>
            </>
          )}

          {noOfPages > 1 && (
            <Pagination
              noOfPages={noOfPages}
              setPage={setPage}
              currentPage={page}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default UserPostsFeed;
