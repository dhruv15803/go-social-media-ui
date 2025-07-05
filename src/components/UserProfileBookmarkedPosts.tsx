import { POSTS_PER_PAGE } from "@/consts";
import { useUserBookmarkedPosts } from "@/Hooks/useUserBookmarkedPosts";
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

const UserProfileBookmarkedPosts = ({ userProfile }: Props) => {
  const [refetchPostsFlag, setRefetchPostsFlag] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const {
    bookmarkedPosts,
    isLoading: isBookmarkedPostsLoading,
    noOfPages,
    error,
  } = useUserBookmarkedPosts(
    userProfile.id,
    page,
    POSTS_PER_PAGE,
    refetchPostsFlag
  );

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

  if (isBookmarkedPostsLoading) {
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
          {bookmarkedPosts !== null &&
            bookmarkedPosts.map((post) => {
              return (
                <PostCard
                  post={post}
                  key={post.id}
                  onDeletePost={handleDeletePostById}
                />
              );
            })}

          {(bookmarkedPosts === null || bookmarkedPosts.length === 0) &&
            error === "" && (
              <>
                <div className="flex items-center justify-center my-4 font-semibold">
                  No Bookmarked posts
                </div>
              </>
            )}

          {error !== "" && (
            <>
              <div className="flex items-center justify-center text-center font-semibold mt-8">
                {userProfile.username} is a private account. Follow to view
                bookmarked posts
              </div>
            </>
          )}
        </div>
        <Pagination
          currentPage={page}
          noOfPages={noOfPages}
          setPage={setPage}
        />
      </div>
    </>
  );
};

export default UserProfileBookmarkedPosts;
