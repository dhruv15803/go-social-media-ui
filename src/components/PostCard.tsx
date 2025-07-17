import type {
  AuthContextType,
  Bookmark,
  Like,
  PostWithMetaData,
} from "@/types";
import { format } from "date-fns";
import { Loader, MessageSquareIcon, TrashIcon, UserIcon } from "lucide-react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useContext, useMemo, useState } from "react";
import { Separator } from "./ui/separator";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { usePostLikes } from "@/Hooks/usePostLikes";
import { AuthContext } from "@/Contexts/AuthContext";
import { Skeleton } from "./ui/skeleton";
import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import axios from "axios";
import { API_URL } from "@/App";
import { toast } from "react-toastify";
import { usePostBookmarks } from "@/Hooks/usePostBookmarks";
import { useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { BsThreeDots } from "react-icons/bs";

type Props = {
  post: PostWithMetaData;
  postCommentsCount?: number;
  onDeletePost?: (postId: number) => void;
};

const PostCard = ({ post, postCommentsCount, onDeletePost }: Props) => {
  const navigate = useNavigate();
  const { loggedInUser, isLoggedInUserLoading, setIsLoginModalOpen } =
    useContext(AuthContext) as AuthContextType;
  const [selectedPostImageIndex, setSelectedPostImageIndex] =
    useState<number>(0);
  const [postLikesCount, setPostLikesCount] = useState<number>(
    post.likes_count
  );
  const [postBookmarksCount, setPostBookmarksCount] = useState<number>(
    post.bookmarks_count
  );
  const { likes, isLoading: isLikesLoading, setLikes } = usePostLikes(post.id);
  const {
    bookmarks,
    isLoading: isBookmarksLoading,
    setBookmarks,
  } = usePostBookmarks(post.id);

  const isLikedByLoggedInUser = useMemo(
    () =>
      loggedInUser !== null && !isLikesLoading && likes !== null
        ? likes.find((like) => like.liked_by_id === loggedInUser.id)
          ? true
          : false
        : false,
    [loggedInUser, isLikesLoading, likes]
  );

  const isBookmarkedByLoggedInUser = useMemo(
    () =>
      loggedInUser !== null && !isBookmarksLoading && bookmarks !== null
        ? bookmarks.find(
            (bookmark) => bookmark.bookmarked_by_id === loggedInUser.id
          )
          ? true
          : false
        : false,
    [loggedInUser, isBookmarksLoading, bookmarks]
  );

  const handleBookmarkPost = async () => {
    if (loggedInUser === null) {
      setIsLoginModalOpen(true);
      return;
    }

    const prevBookmarksCount = postBookmarksCount;
    const prevBookmarks = bookmarks;

    if (isBookmarkedByLoggedInUser) {
      // remove bookmark

      setPostBookmarksCount((prev) => prev - 1);

      const newBookmarks = bookmarks?.filter(
        (bookmark) => bookmark.bookmarked_by_id !== loggedInUser?.id
      );
      setBookmarks(newBookmarks!);
    } else {
      // add bookmark
      setPostBookmarksCount((prev) => prev + 1);

      const newBookmark: Bookmark = {
        bookmarked_by_id: loggedInUser?.id!,
        bookmarked_post_id: post.id,
        bookmarked_at: new Date(Date.now()).toLocaleDateString(),
      };

      bookmarks !== null
        ? setBookmarks((prev) => [...prev!, newBookmark])
        : setBookmarks([newBookmark]);
    }
    try {
      await axios.post(
        `${API_URL}/api/post/${post.id}/bookmark`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      setPostBookmarksCount(prevBookmarksCount);
      setBookmarks(prevBookmarks);
      toast("failed to bookmark");
    }
  };

  const handleLikePost = async () => {
    if (loggedInUser === null) {
      setIsLoginModalOpen(true);
      return;
    }

    const prevLikesCount = postLikesCount;
    const prevLikes = likes;

    if (isLikedByLoggedInUser) {
      setPostLikesCount((prev) => prev - 1);

      const newLikes = likes?.filter(
        (like) => like.liked_by_id !== loggedInUser?.id
      );
      setLikes(newLikes!);
    } else {
      setPostLikesCount((prev) => prev + 1);

      const newLike: Like = {
        liked_by_id: loggedInUser?.id!,
        liked_post_id: post.id,
        liked_at: new Date(Date.now()).toLocaleDateString(),
      };
      likes !== null
        ? setLikes((prev) => [...prev!, newLike])
        : setLikes([newLike]);
    }

    try {
      await axios.post(
        `${API_URL}/api/post/${post.id}/like`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      setPostLikesCount(prevLikesCount);
      setLikes(prevLikes);
      toast("failed to like post");
    }
  };

  if (isLoggedInUserLoading || isLikesLoading) {
    return (
      <>
        <div className="flex flex-col space-y-3 justify-center items-center">
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col border-2 p-4 rounded-lg">
        {loggedInUser?.id === post.user_id && onDeletePost !== undefined && (
          <div className="flex items-center justify-end my-2">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <BsThreeDots />
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => onDeletePost(post.id)}
                  className="flex items-center gap-1"
                >
                  <TrashIcon />
                  <span>Delete post</span>
                </DropdownMenuItem>

                <DropdownMenuItem></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div
            onClick={() => navigate(`/user/${post.user.id}/profile`)}
            className="flex items-center gap-2"
          >
            {post.user.image_url !== null && post.user.image_url !== "" ? (
              <img
                className="border-2 rounded-full p-1 border-teal-500 w-12 h-12"
                src={post.user.image_url}
              />
            ) : (
              <UserIcon />
            )}
            <span className="font-semibold">{post.user.username}</span>
          </div>

          <div>{format(new Date(post.post_created_at), "yyyy/MM/dd")}</div>
        </div>

        {post.post_images !== null && post.post_images.length !== 0 && (
          <>
            <div className="p-2 my-4 w-full flex items-center justify-center">
              {post.post_images.length > 1 && (
                <button
                  onClick={() => setSelectedPostImageIndex((prev) => prev - 1)}
                  disabled={selectedPostImageIndex === 0}
                  className="text-3xl"
                >
                  <IoIosArrowBack />
                </button>
              )}
              <img
                className="w-full aspect-auto rounded-lg"
                src={post.post_images[selectedPostImageIndex].post_image_url}
                alt=""
              />
              {post.post_images.length > 1 && (
                <button
                  onClick={() => setSelectedPostImageIndex((prev) => prev + 1)}
                  disabled={
                    selectedPostImageIndex === post.post_images.length - 1
                  }
                  className="text-3xl"
                >
                  <IoIosArrowForward />
                </button>
              )}
            </div>
            {post.post_images.length > 1 && (
              <div className="flex items-center justify-center gap-1">
                {post.post_images.map((postImage, idx) => {
                  return (
                    <div
                      onClick={() => setSelectedPostImageIndex(idx)}
                      key={postImage.id}
                      className={`border-2 border-teal-500 rounded-full p-1 ${
                        idx === selectedPostImageIndex ? "bg-teal-500" : ""
                      }`}
                    ></div>
                  );
                })}
              </div>
            )}
          </>
        )}

        <div className="flex flex-row flex-wrap text-gray-800 italic p-2 my-2">
          {post.post_content}
        </div>
        <Separator />

        <div className="flex items-center justify-between mt-2">
          {isLikesLoading ? (
            <Loader />
          ) : (
            <button
              onClick={handleLikePost}
              className="flex items-center gap-1"
            >
              {isLikedByLoggedInUser ? <FaThumbsUp /> : <FaRegThumbsUp />}
              <span>{postLikesCount}</span>
            </button>
          )}

          <button
            onClick={() => navigate(`/post/${post.id}`)}
            className="flex items-center gap-1"
          >
            <MessageSquareIcon />
            <span>
              {postCommentsCount ? postCommentsCount : post.comments_count}
            </span>
          </button>

          {isBookmarksLoading ? (
            <>
              <Loader />
            </>
          ) : (
            <button
              onClick={handleBookmarkPost}
              className="flex items-center gap-2"
            >
              {isBookmarkedByLoggedInUser ? <FaBookmark /> : <FaRegBookmark />}
              <span>{postBookmarksCount}</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default PostCard;
