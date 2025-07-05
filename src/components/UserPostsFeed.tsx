import { POSTS_PER_PAGE } from "@/consts";
import { usePostsFeed } from "@/Hooks/usePostsFeed";
import { Loader } from "lucide-react";
import { useState, type SetStateAction } from "react";
import PostCard from "./PostCard";
import Pagination from "./Pagination";
import axios from "axios";
import { API_URL } from "@/App";

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
          {posts.map((post) => {
            return (
              <PostCard
                key={post.id}
                post={post}
                onDeletePost={handleDeletePostById}
              />
            );
          })}
        </div>

        <Pagination
          noOfPages={noOfPages}
          currentPage={page}
          setPage={setPage}
        />
      </div>
    </>
  );
};

export default UserPostsFeed;
