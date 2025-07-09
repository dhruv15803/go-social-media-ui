import CreatePost from "@/components/CreatePost";
import Pagination from "@/components/Pagination";
import PostCard from "@/components/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { POSTS_PER_PAGE } from "@/consts";
import { AuthContext } from "@/Contexts/AuthContext";
import { usePostComments } from "@/Hooks/usePostComments";
import { usePostWithMetaData } from "@/Hooks/usePostWithMetaData";
import type { AuthContextType } from "@/types";
import { Loader } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";

const PostPage = () => {
  const { loggedInUser } = useContext(AuthContext) as AuthContextType;
  const { postId } = useParams<{ postId: string }>();
  if (postId === undefined) return;
  const { post, isLoading: isPostLoading } = usePostWithMetaData(
    parseInt(postId)
  );
  const [postCommentsCount, setPostCommentsCount] = useState<number>(0);
  const [refetchCommentsFlag, setRefetchCommentsFlag] =
    useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

  const {
    comments,
    isLoading: isCommentsLoading,
    noOfPages,
  } = usePostComments(
    parseInt(postId),
    page,
    POSTS_PER_PAGE,
    refetchCommentsFlag
  );

  useEffect(() => {
    if (post === null) return;
    setPostCommentsCount(post.comments_count);
  }, [post]);

  if (isPostLoading) {
    return (
      <>
        <div className="flex flex-col w-full gap-2">
          <Skeleton className="w-full h-[125px] rounded-lg" />

          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded-lg" />
            <Skeleton className="h-4 w-full rounded-lg" />
          </div>
        </div>
      </>
    );
  }

  if (post === null) {
    return (
      <>
        <div className="flex flex-col border-2 rounded-lg p-2 items-center justify-center">
          Post not found
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col">
        <PostCard post={post} postCommentsCount={postCommentsCount} />

        {isCommentsLoading ? (
          <>
            <div className="flex items-center justify-center mt-8">
              <Loader />
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-4 my-4">
              <div className="flex items-center justify-start mx-4 text-lg font-semibold">
                Comments ({postCommentsCount})
              </div>

              {loggedInUser !== null && (
                <CreatePost
                  parentPostId={post.id}
                  setRefetchPostsFlag={setRefetchCommentsFlag}
                  onCreateComment={() =>
                    setPostCommentsCount((prev) => prev + 1)
                  }
                />
              )}

              {comments !== null &&
                comments.map((comment) => {
                  return <PostCard post={comment} key={comment.id} />;
                })}

              {(comments === null || comments.length === 0) && (
                <>
                  <div className="flex items-center justify-center font-normal">
                    No Comments
                  </div>
                </>
              )}

              {noOfPages > 1 && (
                <Pagination
                  setPage={setPage}
                  noOfPages={noOfPages}
                  currentPage={page}
                />
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default PostPage;
