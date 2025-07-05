import type { Follow, FollowRequest, User, UserFollowStatus } from "@/types";
import { UserIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useUserFollowStatus } from "@/Hooks/useUserFollowStatus";
import { API_URL } from "@/App";
import axios from "axios";

type Props = {
  user: User;
};

const UserDisplayCard = ({ user }: Props) => {
  const {
    userFollowStatus: followStatus,
    setFollowRequests,
    setFollowings,
  } = useUserFollowStatus(user.id);
  const handleFollowAction = async (followStatus: UserFollowStatus) => {
    let requestUrl: string;

    if (followStatus === "follow") {
      if (user?.is_public === false) {
        // send a  follow request
        requestUrl = `${API_URL}/api/user/${user.id}/follow-request`;
        const response = await axios.post<{
          success: boolean;
          message: string;
          followRequest: FollowRequest;
        }>(
          requestUrl,
          {},
          {
            withCredentials: true,
          }
        );

        const myNewFollowRequest = response.data.followRequest;
        setFollowRequests((prev) => {
          if (prev === null) {
            return [myNewFollowRequest];
          } else {
            return [...prev, myNewFollowRequest];
          }
        });
      } else {
        // send a follo
        // a follow will be created immediately because public account

        requestUrl = `${API_URL}/api/user/${user.id}/follow`;

        const response = await axios.post<{
          success: boolean;
          message: string;
          follow: Follow;
        }>(
          requestUrl,
          {},
          {
            withCredentials: true,
          }
        );

        setFollowings((prev) => {
          if (prev === null) {
            return [response.data.follow];
          } else {
            return [...prev, response.data.follow];
          }
        });
      }
    } else if (followStatus === "requested") {
      // send a follow request to remove the request

      requestUrl = `${API_URL}/api/user/${user.id}/follow-request`;

      await axios.post(
        requestUrl,
        {},
        {
          withCredentials: true,
        }
      );

      setFollowRequests((prev) => {
        if (prev !== null) {
          return prev?.filter(
            (request) => request.request_receiver_id !== user.id
          );
        } else {
          return null;
        }
      });
    } else {
      // send a follow to remove follow

      requestUrl = `${API_URL}/api/user/${user.id}/follow`;

      await axios.post(
        requestUrl,
        {},
        {
          withCredentials: true,
        }
      );

      setFollowings((prev) => {
        if (prev !== null) {
          return prev.filter((following) => following.following_id !== user.id);
        } else {
          return null;
        }
      });
    }
  };

  return (
    <div key={user.id} className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {user.image_url !== null ? (
          <img className="border-2 rounded-full p-2" src={user.image_url} />
        ) : (
          <UserIcon />
        )}
        <span className="font-semibold">{user.username}</span>
      </div>
      <Button
        onClick={() => handleFollowAction(followStatus)}
        className={` border-2 ${
          followStatus === "follow"
            ? "bg-teal-500 text-white"
            : followStatus === "following"
            ? "border-teal-500 text-teal-500 bg-white"
            : "bg-white text-black"
        }`}
      >
        {followStatus}
      </Button>
    </div>
  );
};

export default UserDisplayCard;
