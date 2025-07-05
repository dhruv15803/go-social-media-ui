import { API_URL } from "@/App";
import type { Follow } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const useMyFollowings = () => {
  const [followings, setFollowings] = useState<Follow[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchMyFollowings = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get<{
          success: boolean;
          followings: Follow[];
        }>(`${API_URL}/api/user/my-followings`, {
          withCredentials: true,
        });

        setFollowings(response.data.followings);
      } catch (error) {
        toast("failed to fetch authenticated user's followings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyFollowings();
  }, []);

  return {
    followings,
    isLoading,
    setFollowings,
  };
};
