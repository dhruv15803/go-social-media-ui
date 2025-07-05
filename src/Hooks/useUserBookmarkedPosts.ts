import { API_URL } from "@/App";
import type { PostWithMetaData } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

export const useUserBookmarkedPosts = (
  userId: number,
  page: number,
  limit: number,
  refetchPostsFlag: boolean
) => {
  const [bookmarkedPosts, setBookmarkedPosts] = useState<
    PostWithMetaData[] | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [noOfPages, setNoOfPages] = useState<number>(0);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const queryParams = new URLSearchParams();
    queryParams.set("page", page.toString());
    queryParams.set("limit", limit.toString());

    const fetchUserBookmarkedPosts = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get<{
          success: boolean;
          bookmarked_posts: PostWithMetaData[] | null;
          noOfPages: number;
        }>(
          `${API_URL}/api/user/${userId}/bookmarked-posts?${queryParams.toString()}`,
          {
            withCredentials: true,
          }
        );

        setBookmarkedPosts(response.data.bookmarked_posts);
        setNoOfPages(response.data.noOfPages);
      } catch (error: any) {
        setError(error.response.data.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserBookmarkedPosts();
  }, [userId, page, limit, refetchPostsFlag]);

  return { bookmarkedPosts, noOfPages, isLoading, error };
};
