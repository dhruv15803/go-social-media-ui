import { API_URL } from "@/App";
import type { PostWithMetaData } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

export const useUserLikedPosts = (
  userId: number,
  page: number,
  limit: number,
  refetchPostsFlag: boolean
) => {
  const [likedPosts, setLikedPosts] = useState<PostWithMetaData[] | null>(null);
  const [noOfPages, setNoOfPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const queryParams = new URLSearchParams();
    queryParams.set("page", page.toString());
    queryParams.set("limit", limit.toString());

    const fetchUserLikedPosts = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get<{
          success: boolean;
          liked_posts: PostWithMetaData[] | null;
          noOfPages: number;
        }>(
          `${API_URL}/api/user/${userId}/liked-posts?${queryParams.toString()}`,
          {
            withCredentials: true,
          }
        );

        setLikedPosts(response.data.liked_posts);
        setNoOfPages(response.data.noOfPages);
      } catch (error: any) {
        setError(error.response.data.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserLikedPosts();
  }, [userId, page, limit, refetchPostsFlag]);

  return { likedPosts, isLoading, noOfPages, error };
};
