import { API_URL } from "@/App";
import type { FollowRequestWithSender } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const useMyFollowRequestsReceived = (
  page: number,
  limit: number,
  refetchRequestsFlag: boolean
) => {
  const [followRequestsReceived, setFollowRequestsReceived] = useState<
    FollowRequestWithSender[] | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [noOfPages, setNoOfPages] = useState<number>(0);

  useEffect(() => {
    const fetchFollowRequestsReceived = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get<{
          success: boolean;
          follow_requests_received: FollowRequestWithSender[] | null;
          noOfPages: number;
        }>(
          `${API_URL}/api/user/my-requests-received?page=${page}&limit=${limit}`,
          {
            withCredentials: true,
          }
        );
        setFollowRequestsReceived(response.data.follow_requests_received);
        setNoOfPages(response.data.noOfPages);
      } catch (error) {
        toast("failed to get requests received");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFollowRequestsReceived();
  }, [page, limit, refetchRequestsFlag]);

  return { followRequestsReceived, isLoading, noOfPages };
};
