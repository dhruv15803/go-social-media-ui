import type { SetStateAction } from "react";
import type React from "react";

export type User = {
  id: number;
  email: string;
  username: string;
  image_url: string | null;
  bio: string | null;
  location: string | null;
  date_of_birth: string;
  is_public: boolean;
  created_at: string;
  updated_at: string | null;
};

export type RegisterUserResponse = {
  success: boolean;
  message: string;
  user: User;
};

export type LoginUserResponse = {
  success: boolean;
  message: string;
  user: User;
};

export type AuthContextType = {
  loggedInUser: User | null;
  setLoggedInUser: React.Dispatch<SetStateAction<User | null>>;
  isLoggedInUserLoading: boolean;
};

export type Post = {
  id: number;
  post_content: string;
  user_id: number;
  parent_post_id: number | null;
  post_created_at: string;
  post_updated_at: string | null;
};

export type PostImage = {
  id: number;
  post_image_url: string;
  post_id: number;
};

export type PostWithUser = Post & {
  user: User;
};

export type PostWithUserAndImages = PostWithUser & {
  post_images: PostImage[];
};

export type PostWithMetaData = PostWithUserAndImages & {
  likes_count: number;
  comments_count: number;
  bookmarks_count: number;
};

export type Like = {
  liked_by_id: number;
  liked_post_id: number;
  liked_at: string;
};

export type Bookmark = {
  bookmarked_by_id: number;
  bookmarked_post_id: number;
  bookmarked_at: string;
};

export type UserProfile = User & {
  no_of_posts: number;
  followers_count: number;
  followings_count: number;
};

export type Follow = {
  follower_id: number;
  following_id: number;
  followed_at: string;
};

export type FollowRequest = {
  request_sender_id: number;
  request_receiver_id: number;
  request_at: string;
};

export type FollowRequestWithSender = FollowRequest & {
  request_sender: User;
};

export type UserFollowStatus = "follow" | "requested" | "following";

export type Notification = {
  id: number;
  user_id: number;
  notification_type: "like" | "comment";
  actor_id: number;
  notification_created_at: string;
  post_id: number;
};

export type NotificationWithActor = Notification & {
  actor: User;
};
