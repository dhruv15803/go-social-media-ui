import { API_URL } from "@/App";
import type { PostWithMetaData } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const usePostComments = (
  postId: number,
  page: number,
  limit: number,
  refetchCommentsFlag: boolean
) => {
  const [comments, setComments] = useState<PostWithMetaData[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [noOfPages, setNoOfPages] = useState<number>(0);

  useEffect(() => {
    const queryParams = new URLSearchParams();
    queryParams.set("page", page.toString());
    queryParams.set("limit", limit.toString());

    const fetchPostComments = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get<{
          success: boolean;
          comments: PostWithMetaData[];
          noOfPages: number;
        }>(`${API_URL}/api/post/${postId}/comments?${queryParams.toString()}`);
        setComments(response.data.comments);
        setNoOfPages(response.data.noOfPages);
      } catch (error) {
        toast("failed to fetch post comments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostComments();
  }, [postId, page, limit, refetchCommentsFlag]);

  return { comments, isLoading, noOfPages };
};
