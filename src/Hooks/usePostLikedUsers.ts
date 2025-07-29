import { API_URL } from "@/App";
import type { User } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

export const usePostLikedUsers = (
  postId: number,
  page: number,
  limit: number
) => {
  const [users, setUsers] = useState<User[] | null>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [noOfPages, setNoOfPages] = useState<number>(0);

  useEffect(() => {
    const fetchPostLikedUsers = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get<{
          success: boolean;
          users: User[];
          noOfPages: number;
        }>(
          `${API_URL}/api/post/${postId}/liked-users?page=${page}&limit=${limit}`
        );

        setUsers(response.data.users);
        setNoOfPages(response.data.noOfPages);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostLikedUsers();
  }, [postId]);

  return { users, isLoading, noOfPages };
};
