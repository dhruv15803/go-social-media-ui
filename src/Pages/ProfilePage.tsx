import { AuthContext } from "@/Contexts/AuthContext";
import type { AuthContextType } from "@/types";
import { UserIcon } from "lucide-react";
import { useContext } from "react";
import { format } from "date-fns";
import { FaLocationDot } from "react-icons/fa6";
import { CiCalendarDate } from "react-icons/ci";
import { useUserProfile } from "@/Hooks/useUserProfile";
import { Skeleton } from "@/components/ui/skeleton";
import UserProfilePosts from "@/components/UserProfilePosts";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { loggedInUser } = useContext(AuthContext) as AuthContextType;
  const { userProfile, isLoading: isProfileLoading } = useUserProfile(
    loggedInUser?.id!
  );

  if (isProfileLoading) {
    return (
      <>
        <div className="flex flex-col p-4 border-2 rounded-lg">
          <div className="flex items-center gap-1">
            <Skeleton className="rounded-full w-48 h-48" />

            <Skeleton className="min-w-md rounded-lg h-48" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col border-2 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <div className="border-2 p-4 rounded-full">
            {loggedInUser ? (
              <img src={loggedInUser.image_url!} />
            ) : (
              <UserIcon />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-lg font-semibold">
              @{loggedInUser?.username}
            </span>

            <div className="flex items-center justify-between">
              {loggedInUser?.location !== null && (
                <div className="flex items-center gap-1">
                  <FaLocationDot />
                  <span className="font-semibold">
                    {loggedInUser?.location}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-1">
                <CiCalendarDate />
                {loggedInUser?.date_of_birth !== null && (
                  <span className="font-semibold">
                    {format(
                      new Date(loggedInUser?.date_of_birth!),
                      "yyyy/MM/dd"
                    )}
                  </span>
                )}
              </div>
            </div>

            <div>
              <Button
                onClick={() => navigate("/user/profile/edit")}
                variant="outline"
                className="text-teal-500 border-2 border-teal-500 hover:bg-teal-500 hover:text-white hover:duration-300"
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center">
            <div className="font-semibold">{userProfile?.no_of_posts}</div>
            <div>posts</div>
          </div>

          <div className="flex flex-col items-center">
            <div className="font-semibold">{userProfile?.followers_count}</div>
            <div>followers</div>
          </div>

          <div className="flex flex-col items-center">
            <div className="font-semibold">{userProfile?.followings_count}</div>
            <div>followings</div>
          </div>
        </div>
      </div>

      {userProfile !== null && <UserProfilePosts userProfile={userProfile} />}
    </>
  );
};

export default ProfilePage;
