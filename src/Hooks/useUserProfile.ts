import { API_URL } from "@/App";
import type { UserProfile } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const useUserProfile = (userId: number) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get<{
          success: boolean;
          profile: UserProfile;
        }>(`${API_URL}/api/user/${userId}/profile`);

        setUserProfile(response.data.profile);
      } catch (error) {
        toast("failed to get user profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  return { userProfile, isLoading };
};
