import { API_URL } from "@/App";
import type { PostWithMetaData } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const usePostsFeed = (
  page: number,
  limit: number,
  refetchFlag: boolean
) => {
  const [posts, setPosts] = useState<PostWithMetaData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [noOfPages, setNoOfPages] = useState<number>(0);

  useEffect(() => {
    const fetchPostsFeed = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get<{
          success: boolean;
          posts: PostWithMetaData[];
          noOfPages: number;
        }>(`${API_URL}/api/post/feed?page=${page}&limit=${limit}`, {
          withCredentials: true,
        });

        setPosts(response.data.posts);
        setNoOfPages(response.data.noOfPages);
      } catch (error) {
        toast("failed to fetch feed");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostsFeed();
  }, [page, limit, refetchFlag]);

  return { posts, isLoading, noOfPages };
};
