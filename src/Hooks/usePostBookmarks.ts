import { API_URL } from "@/App";
import type { Bookmark } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const usePostBookmarks = (postId: number) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPostBookmarks = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get<{
          success: boolean;
          bookmarks: Bookmark[];
        }>(`${API_URL}/api/post/${postId}/bookmarks`);

        setBookmarks(response.data.bookmarks);
      } catch (error) {
        toast("failed to fetch post bookmarks");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostBookmarks();
  }, [postId]);

  return { bookmarks, isLoading, setBookmarks };
};
