import { POSTS_PER_PAGE } from "@/consts";
import { useUserPosts } from "@/Hooks/useUserPosts";
import type { UserProfile } from "@/types";
import { Loader } from "lucide-react";
import { useState } from "react";
import PostCard from "./PostCard";
import Pagination from "./Pagination";
import axios from "axios";
import { API_URL } from "@/App";

type Props = {
  userProfile: UserProfile;
};

const UserProfileMyPosts = ({ userProfile }: Props) => {
  const [refetchPostsFlag, setRefetchPostsFlag] = useState(false);
  const [page, setPage] = useState<number>(1);
  const {
    posts,
    noOfPages,
    isLoading: isPostsLoading,
    error,
  } = useUserPosts(userProfile.id, page, POSTS_PER_PAGE, refetchPostsFlag);

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
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          {posts !== null &&
            posts.map((post) => {
              return (
                <PostCard
                  post={post}
                  key={post.id}
                  onDeletePost={handleDeletePostById}
                />
              );
            })}

          {(posts === null || posts.length === 0) && error === "" && (
            <>
              <div className="flex items-center justify-center font-semibold mt-8">
                No Posts
              </div>
            </>
          )}

          {error !== "" && (
            <>
              <div className="flex items-center justify-center text-center font-semibold mt-8">
                {userProfile.username} is a private account. Follow to view
                posts
              </div>
            </>
          )}
        </div>

        {noOfPages > 1 && (
          <Pagination
            currentPage={page}
            setPage={setPage}
            noOfPages={noOfPages}
          />
        )}
      </div>
    </>
  );
};

export default UserProfileMyPosts;
