import { API_URL } from "@/App";
import type { Like } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const usePostLikes = (postId: number) => {
  const [likes, setLikes] = useState<Like[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPostLikes = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<{ success: boolean; likes: Like[] }>(
          `${API_URL}/api/post/${postId}/likes`
        );
        setLikes(response.data.likes);
      } catch (error) {
        toast(`failed to fetch post ${postId} likes`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostLikes();
  }, [postId]);

  return {
    likes,
    isLoading,
    setLikes,
  };
};
