import { API_URL } from "@/App";
import type { FollowRequest } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const useMyFollowRequestsSent = () => {
  const [followRequests, setFollowRequests] = useState<FollowRequest[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMyFollowRequestsSent = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get<{
          success: boolean;
          follow_requests: FollowRequest[] | null;
        }>(`${API_URL}/api/user/my-requests-sent`, {
          withCredentials: true,
        });
        setFollowRequests(response.data.follow_requests);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyFollowRequestsSent();
  }, []);

  return { followRequests, isLoading, setFollowRequests };
};
