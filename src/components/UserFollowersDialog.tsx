import { FOLLOWERS_PER_PAGE } from "@/consts";
import { useUserFollowers } from "@/Hooks/useUserFollowers";
import React, { useState, type SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

import { Skeleton } from "./ui/skeleton";
import Pagination from "./Pagination";
import UserDisplayCard from "./UserDisplayCard";

type Props = {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<SetStateAction<boolean>>;
  userId: number;
};

const UserFollowersDialog = ({
  isDialogOpen,
  setIsDialogOpen,
  userId,
}: Props) => {
  const [page, setPage] = useState<number>(1);
  const {
    followers,
    isLoading: isFollowersLoading,
    noOfPages,
  } = useUserFollowers(userId, page, FOLLOWERS_PER_PAGE);

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Followers</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            {isFollowersLoading ? (
              <>
                {[1, 2, 3, 4, 5].map((val) => {
                  return <Skeleton key={val} className="rounded-lg p-4" />;
                })}
              </>
            ) : (
              <>
                {followers !== null &&
                  followers.map((follower) => {
                    return (
                      <UserDisplayCard user={follower} key={follower.id} />
                    );
                  })}
                {(followers === null || followers.length === 0) && (
                  <>
                    <div className="flex items-center justify-center font-semibold">
                      No Followers
                    </div>
                  </>
                )}
              </>
            )}
            <div className="flex items-center justify-center">
              {noOfPages > 1 && (
                <Pagination
                  currentPage={page}
                  noOfPages={noOfPages}
                  setPage={setPage}
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserFollowersDialog;
