import { API_URL } from "@/App";
import type { PostWithMetaData } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const usePublicPosts = (page: number, limit: number) => {
  const [posts, setPosts] = useState<PostWithMetaData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [noOfPages, setNoOfPages] = useState<number>(0);

  useEffect(() => {
    const fetchPublicPosts = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get<{
          success: boolean;
          posts: PostWithMetaData[];
          noOfPages: number;
        }>(`${API_URL}/api/post/posts?page=${page}&limit=${limit}`);

        setPosts(response.data.posts);
        setNoOfPages(response.data.noOfPages);
      } catch (error) {
        toast("failed to fetch public posts");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPublicPosts();
  }, [page, limit]);

  return { posts, isLoading, noOfPages };
};
