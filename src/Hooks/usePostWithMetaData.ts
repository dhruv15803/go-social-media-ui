import { API_URL } from "@/App";
import type { PostWithMetaData } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const usePostWithMetaData = (postId: number) => {
  const [post, setPost] = useState<PostWithMetaData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPostWithMetaData = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get<{
          success: boolean;
          post: PostWithMetaData;
        }>(`${API_URL}/api/post/${postId}/metadata`);
        setPost(response.data.post);
      } catch (error) {
        toast("failed to get post with metadata");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostWithMetaData();
  }, [postId]);

  return {
    post,
    isLoading,
  };
};
