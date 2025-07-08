import { API_URL } from "@/App";
import type { NotificationWithActor } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const useMyNotifications = (page: number, limit: number) => {
  const [notifications, setNotifications] = useState<
    NotificationWithActor[] | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [noOfPages, setNoOfPages] = useState<number>(0);

  useEffect(() => {
    const fetchMyNotifications = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get<{
          success: boolean;
          notifications: NotificationWithActor[] | null;
          noOfPages: number;
        }>(`${API_URL}/api/user/notifications?page=${page}&limit=${limit}`, {
          withCredentials: true,
        });

        setNotifications(response.data.notifications);
        setNoOfPages(response.data.noOfPages);
      } catch (error) {
        toast("failed to get notifications");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyNotifications();
  }, [page, limit]);

  return { notifications, noOfPages, isLoading };
};
