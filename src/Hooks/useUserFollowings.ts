import { API_URL } from "@/App";
import type { User } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const useUserFollowings = (
  userId: number,
  page: number,
  limit: number
) => {
  const [followings, setFollowings] = useState<User[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [noOfPages, setNoOfPages] = useState<number>(0);

  useEffect(() => {
    const fetchUserFollowings = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get<{
          success: boolean;
          followings: User[];
          noOfPages: number;
        }>(
          `${API_URL}/api/user/${userId}/followings?page=${page}&limit=${limit}`,
          {
            withCredentials: true,
          }
        );

        setFollowings(response.data.followings);
        setNoOfPages(response.data.noOfPages);
      } catch (error) {
        toast("failed to get user's followings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserFollowings();
  }, [userId, page, limit]);

  return { followings, noOfPages, isLoading };
};
