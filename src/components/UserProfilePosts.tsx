import type { UserProfile } from "@/types";
import { useState } from "react";
import UserProfileMyPosts from "./UserProfileMyPosts";
import UserProfileLikedPosts from "./UserProfileLikedPosts";
import UserProfileBookmarkedPosts from "./UserProfileBookmarkedPosts";

type Props = {
  userProfile: UserProfile;
};

type ProfileTabs = "my-posts" | "liked-posts" | "bookmarked-posts";

const UserProfilePosts = ({ userProfile }: Props) => {
  const [currentProfileTab, setCurrentProfileTab] =
    useState<ProfileTabs>("my-posts");

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex item-center border-2 rounded-lg p-4 mb-2 justify-between">
          <button
            onClick={() => setCurrentProfileTab("my-posts")}
            className={`${
              currentProfileTab === "my-posts"
                ? "text-teal-500 font-semibold"
                : "font-semibold"
            }`}
          >
            Posts
          </button>

          <button
            onClick={() => setCurrentProfileTab("liked-posts")}
            className={`${
              currentProfileTab === "liked-posts"
                ? "text-teal-500 font-semibold"
                : "font-semibold"
            }`}
          >
            Liked
          </button>

          <button
            onClick={() => setCurrentProfileTab("bookmarked-posts")}
            className={`${
              currentProfileTab === "bookmarked-posts"
                ? "text-teal-500 font-semibold"
                : "font-semibold"
            }`}
          >
            Bookmarked
          </button>
        </div>

        {currentProfileTab === "my-posts" && (
          <UserProfileMyPosts userProfile={userProfile} />
        )}
        {currentProfileTab === "liked-posts" && (
          <UserProfileLikedPosts userProfile={userProfile} />
        )}
        {currentProfileTab === "bookmarked-posts" && (
          <UserProfileBookmarkedPosts userProfile={userProfile} />
        )}
      </div>
    </>
  );
};

export default UserProfilePosts;
