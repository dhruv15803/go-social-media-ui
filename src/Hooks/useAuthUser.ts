import { API_URL } from "@/App";
import type { User } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

export const useAuthUser = () => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAuthUser = async () => {
      console.log("fetching auth user");
      try {
        setIsLoading(true);

        const response = await axios.get<{ success: boolean; user: User }>(
          `${API_URL}/api/auth/user`,
          {
            withCredentials: true,
          }
        );
        setAuthUser(response.data.user);
        console.log("fetched user successfully :- ", response.data.user);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthUser();
  }, []);

  return {
    authUser,
    setAuthUser,
    isLoading,
  };
};
