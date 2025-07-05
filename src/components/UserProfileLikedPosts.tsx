import { POSTS_PER_PAGE } from "@/consts";
import { useUserLikedPosts } from "@/Hooks/useUserLikedPosts";
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

const UserProfileLikedPosts = ({ userProfile }: Props) => {
  const [refetchPostsFlag, setRefetchPostsFlag] = useState(false);
  const [page, setPage] = useState<number>(1);
  const {
    likedPosts,
    isLoading: isLikedPostsLoading,
    noOfPages,
    error,
  } = useUserLikedPosts(userProfile.id, page, POSTS_PER_PAGE, refetchPostsFlag);

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

  if (isLikedPostsLoading) {
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
          {likedPosts !== null &&
            likedPosts.map((post) => {
              return (
                <PostCard
                  post={post}
                  key={post.id}
                  onDeletePost={handleDeletePostById}
                />
              );
            })}

          {(likedPosts === null || likedPosts.length === 0) && error === "" && (
            <>
              <div className="flex items-center justify-center my-4 font-semibold">
                No Liked Posts
              </div>
            </>
          )}

          {error !== "" && (
            <>
              <div className="flex items-center justify-center font-semibold text-center mt-8">
                {userProfile.username} is a private account. Follow to view
                Liked posts
              </div>
            </>
          )}
        </div>

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

export default UserProfileLikedPosts;
