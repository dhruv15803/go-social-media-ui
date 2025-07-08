import { usePostWithMetaData } from "@/Hooks/usePostWithMetaData";
import type { NotificationWithActor } from "@/types";
import { UserIcon } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Skeleton } from "./ui/skeleton";

type Props = {
  notification: NotificationWithActor;
};

const POST_CONTENT_CHARACTER_LIMIT = 90;

const NotificationCard = ({ notification }: Props) => {
  const { post, isLoading: isPostLoading } = usePostWithMetaData(
    notification.post_id
  );
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col w-full p-4 gap-4 border-b-2">
        <div
          key={notification.id}
          className={`flex items-center justify-between`}
        >
          <div className="flex items-center gap-2">
            {notification.actor.image_url !== null &&
            notification.actor.image_url !== "" ? (
              <img
                src={notification.actor.image_url}
                className="rounded-full w-12 h-12"
              />
            ) : (
              <UserIcon />
            )}
            <p>
              <span className="font-semibold">
                {notification.actor.username}
              </span>{" "}
              {notification.notification_type === "like"
                ? "liked your post"
                : "commented on your post"}
            </p>
          </div>
          <Link
            to={`/post/${notification.post_id}`}
            className="text-teal-500 font-semibold"
          >
            View Post
          </Link>
        </div>

        {isPostLoading && <Skeleton className="w-full rounded-lg h-24" />}
        {post !== null && (
          <div
            onClick={() => navigate(`/post/${post.id}`)}
            className="flex flex-row gap-2 hover:bg-gray-50 hover:duration-300 p-2"
          >
            <div className="flex items-center flex-wrap gap-1 max-w-[40%]  ">
              {post.post_images.map((postImage) => {
                return (
                  <img
                    key={postImage.id}
                    className="rounded-lg w-12 aspect-auto"
                    src={postImage.post_image_url}
                  />
                );
              })}
            </div>
            <div className="flex flex-wrap w-full light italic">
              {post.post_content.length < POST_CONTENT_CHARACTER_LIMIT
                ? post.post_content
                : post.post_content.slice(0, POST_CONTENT_CHARACTER_LIMIT) +
                  "..."}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationCard;
