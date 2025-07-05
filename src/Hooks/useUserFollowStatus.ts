import type { UserFollowStatus } from "@/types";
import { useMyFollowings } from "./useMyFollowings";
import { useMyFollowRequestsSent } from "./useMyFollowRequestsSent";
import { useEffect, useState } from "react";

export const useUserFollowStatus = (userId: number) => {
  const {
    followings,
    isLoading: isFollowingsLoading,
    setFollowings,
  } = useMyFollowings();
  const {
    followRequests,
    isLoading: isFollowRequestsLoading,
    setFollowRequests,
  } = useMyFollowRequestsSent();
  const [userFollowStatus, setUserFollowStatus] =
    useState<UserFollowStatus>("follow");

  const checkFollowing = (): boolean => {
    const isFollowing = followings?.find(
      (following) => following.following_id === userId
    );
    return isFollowing ? true : false;
  };

  const checkRequest = (): boolean => {
    const isRequested = followRequests?.find(
      (request) => request.request_receiver_id === userId
    );
    return isRequested ? true : false;
  };

  useEffect(() => {
    if (isFollowingsLoading || isFollowRequestsLoading) return;

    if (checkFollowing()) {
      setUserFollowStatus("following");
    } else if (checkRequest()) {
      setUserFollowStatus("requested");
    } else {
      setUserFollowStatus("follow");
    }
  }, [
    followRequests,
    followings,
    isFollowingsLoading,
    isFollowRequestsLoading,
  ]);

  return {
    userFollowStatus,
    isFollowingsLoading,
    isFollowRequestsLoading,
    setFollowings,
    setFollowRequests,
  };
};
