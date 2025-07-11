import { useUserProfile } from "@/Hooks/useUserProfile";
import { Loader, UserIcon } from "lucide-react";
import { CiCalendarDate } from "react-icons/ci";
import { FaLocationDot } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router";
import { format } from "date-fns";
import UserProfilePosts from "@/components/UserProfilePosts";
import { Button } from "@/components/ui/button";
import { useContext, useState } from "react";
import { AuthContext } from "@/Contexts/AuthContext";
import type {
  AuthContextType,
  Follow,
  FollowRequest,
  UserFollowStatus,
} from "@/types";
import UserFollowingsDialog from "@/components/UserFollowingsDialog";
import UserFollowersDialog from "@/components/UserFollowersDialog";
import { useUserFollowStatus } from "@/Hooks/useUserFollowStatus";
import { API_URL } from "@/App";
import axios from "axios";
import { toast } from "react-toastify";

const UserProfilePage = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  if (userId === undefined) return <>user id not available</>;
  const { loggedInUser, setLoggedInUser } = useContext(
    AuthContext
  ) as AuthContextType;
  const { userProfile, isLoading: isUserProfileLoading } = useUserProfile(
    parseInt(userId)
  );
  const [isFollowersDialogOpen, setIsFollowersDialogOpen] =
    useState<boolean>(false);
  const [isFollowingsDialogOpen, setIsFollowingsDialogOpen] =
    useState<boolean>(false);
  const {
    userFollowStatus: followStatus,
    setFollowings,
    setFollowRequests,
  } = useUserFollowStatus(parseInt(userId));

  const handleFollowAction = async (followStatus: UserFollowStatus) => {
    let requestUrl: string;

    if (followStatus === "follow") {
      if (userProfile?.is_public === false) {
        // send a  follow request
        requestUrl = `${API_URL}/api/user/${userId}/follow-request`;

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

        requestUrl = `${API_URL}/api/user/${userId}/follow`;

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

      requestUrl = `${API_URL}/api/user/${userId}/follow-request`;

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
            (request) => request.request_receiver_id !== parseInt(userId)
          );
        } else {
          return null;
        }
      });
    } else {
      // send a follow to remove follow

      requestUrl = `${API_URL}/api/user/${userId}/follow`;

      await axios.post(
        requestUrl,
        {},
        {
          withCredentials: true,
        }
      );

      setFollowings((prev) => {
        if (prev !== null) {
          return prev.filter(
            (following) => following.following_id !== parseInt(userId)
          );
        } else {
          return null;
        }
      });
    }
  };

  const handleLogoutUser = async () => {
    try {
      await axios.get<{ success: boolean; message: string }>(
        `${API_URL}/api/auth/logout`,
        {
          withCredentials: true,
        }
      );
      setLoggedInUser(null);
      navigate("/signin");
    } catch (error) {
      toast("failed to logout");
    }
  };

  if (isUserProfileLoading) {
    return (
      <>
        <div className="flex items-center justify-center mt-24">
          <Loader />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col border-2 rounded-lg p-4 ">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 w-full">
            {userProfile !== null &&
            userProfile.image_url !== null &&
            userProfile.image_url !== "" ? (
              <img
                src={userProfile.image_url!}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <UserIcon />
            )}

            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-lg font-semibold">
                    @{userProfile?.username}
                  </span>
                  {loggedInUser !== null &&
                    loggedInUser.id !== parseInt(userId) && (
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
                    )}
                </div>

                {loggedInUser?.id === userProfile?.id && (
                  <Button
                    onClick={handleLogoutUser}
                    className="bg-teal-500 text-white hover:bg-teal-600 hover:duration-300"
                  >
                    Logout
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-6">
                {userProfile?.location !== null &&
                  userProfile?.location !== "" && (
                    <div className="flex items-center gap-1">
                      <FaLocationDot />
                      <span className="font-semibold">
                        {userProfile?.location}
                      </span>
                    </div>
                  )}

                <div className="flex items-center gap-1">
                  <CiCalendarDate />
                  {userProfile?.date_of_birth !== undefined && (
                    <span className="font-semibold">
                      {format(
                        new Date(userProfile?.date_of_birth!),
                        "yyyy/MM/dd"
                      )}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-row flex-wrap font-light">
                {userProfile?.bio}
              </div>
              <div>
                {loggedInUser !== null &&
                  loggedInUser.id === parseInt(userId) && (
                    <Button
                      onClick={() => navigate("/user/profile/edit")}
                      variant="outline"
                      className="text-teal-500 border-2 border-teal-500 hover:bg-teal-500 hover:text-white hover:duration-300"
                    >
                      Edit Profile
                    </Button>
                  )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center">
            <div className="font-semibold">{userProfile?.no_of_posts}</div>
            <div>posts</div>
          </div>

          <button
            onClick={() => setIsFollowersDialogOpen(true)}
            className="flex flex-col items-center"
          >
            <div className="font-semibold">{userProfile?.followers_count}</div>
            <div>followers</div>
          </button>
          {isFollowersDialogOpen && (
            <UserFollowersDialog
              isDialogOpen={isFollowersDialogOpen}
              setIsDialogOpen={setIsFollowersDialogOpen}
              userId={parseInt(userId)}
            />
          )}

          <button
            onClick={() => setIsFollowingsDialogOpen(true)}
            className="flex flex-col items-center"
          >
            <div className="font-semibold">{userProfile?.followings_count}</div>
            <div>followings</div>
          </button>
          {isFollowingsDialogOpen && (
            <UserFollowingsDialog
              isDialogOpen={isFollowingsDialogOpen}
              setIsDialogOpen={setIsFollowingsDialogOpen}
              userId={parseInt(userId)}
            />
          )}
        </div>
      </div>
      {userProfile !== null && <UserProfilePosts userProfile={userProfile} />}
    </>
  );
};

export default UserProfilePage;
