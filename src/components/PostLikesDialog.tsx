import { LIKED_USERS_PER_PAGE } from "@/consts";
import { usePostLikedUsers } from "@/Hooks/usePostLikedUsers";
import { useState, type SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Skeleton } from "./ui/skeleton";
import Pagination from "./Pagination";
import { UserIcon } from "lucide-react";

type Props = {
  postId: number;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<SetStateAction<boolean>>;
};

const PostLikesDialog = ({ postId, isDialogOpen, setIsDialogOpen }: Props) => {
  const [page, setPage] = useState<number>(1);
  const { users, isLoading, noOfPages } = usePostLikedUsers(
    postId,
    page,
    LIKED_USERS_PER_PAGE
  );

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Post Likes</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => {
                return (
                  <Skeleton key={val} className="w-full h-16 rounded-lg" />
                );
              })}
            </>
          ) : (
            <>
              {users !== null &&
                users.map((user) => {
                  return (
                    <div key={user.id} className="flex items-center gap-2">
                      {user.image_url !== null && user.image_url !== "" ? (
                        <img
                          className="rounded-full w-12 h-12"
                          src={user.image_url}
                        />
                      ) : (
                        <UserIcon />
                      )}
                      <span className="font-semibold">{user.username}</span>
                    </div>
                  );
                })}

              {(users == null || users.length === 0) && (
                <div className="flex items-center justify-center gap-2">
                  No likes
                </div>
              )}

              {noOfPages > 1 && (
                <Pagination
                  currentPage={page}
                  noOfPages={noOfPages}
                  setPage={setPage}
                />
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostLikesDialog;
