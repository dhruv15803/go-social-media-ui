import { API_URL } from "@/App";
import type { User } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const useUserFollowers = (
  userId: number,
  page: number,
  limit: number
) => {
  const [followers, setFollowers] = useState<User[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [noOfPages, setNoOfPages] = useState<number>(0);

  useEffect(() => {
    const fetchUserFollowers = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get<{
          success: boolean;
          followers: User[] | null;
          noOfPages: number;
        }>(
          `${API_URL}/api/user/${userId}/followers?page=${page}&limit=${limit}`,
          {
            withCredentials: true,
          }
        );

        setFollowers(response.data.followers);
        setNoOfPages(response.data.noOfPages);
      } catch (error) {
        toast("failed to get user followers");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserFollowers();
  }, [userId, page, limit]);

  return { followers, isLoading, noOfPages };
};
