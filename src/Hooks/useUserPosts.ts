import { API_URL } from "@/App";
import type { PostWithMetaData } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

export const useUserPosts = (
  userId: number,
  page: number,
  limit: number,
  refetchPostsFlag: boolean
) => {
  const [posts, setPosts] = useState<PostWithMetaData[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [noOfPages, setNoOfPages] = useState<number>(0);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUserPosts = async () => {
      const queryParams = new URLSearchParams();
      queryParams.set("page", page.toString());
      queryParams.set("limit", limit.toString());

      try {
        setIsLoading(true);

        const response = await axios.get<{
          success: boolean;
          posts: PostWithMetaData[] | null;
          noOfPages: number;
        }>(`${API_URL}/api/user/${userId}/posts?${queryParams.toString()}`, {
          withCredentials: true,
        });

        setPosts(response.data.posts);
        setNoOfPages(response.data.noOfPages);
      } catch (error: any) {
        console.log(error);
        setError(error.response.data.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPosts();
  }, [userId, page, limit, refetchPostsFlag]);

  return { posts, isLoading, noOfPages, error };
};
