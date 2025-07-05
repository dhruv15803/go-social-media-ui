import React, { useState, type SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useUserFollowings } from "@/Hooks/useUserFollowings";
import { FOLLOWINGS_PER_PAGE } from "@/consts";
import { Skeleton } from "./ui/skeleton";
import Pagination from "./Pagination";
import UserDisplayCard from "./UserDisplayCard";

type Props = {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<SetStateAction<boolean>>;
  userId: number;
};

const UserFollowingsDialog = ({
  isDialogOpen,
  setIsDialogOpen,
  userId,
}: Props) => {
  const [page, setPage] = useState<number>(1);
  const {
    followings,
    isLoading: isFollowingsLoading,
    noOfPages,
  } = useUserFollowings(userId, page, FOLLOWINGS_PER_PAGE);

  // we have to check if the logged in user is either following the user , has sent a follow request to the user or none
  // when following the user -> show "following" button
  // when follow request has been sent -> show "requested" button
  // when neither -> show "follow" button

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Followings</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            {isFollowingsLoading ? (
              <>
                {[1, 2, 3, 4, 5].map((val) => {
                  return <Skeleton key={val} className="rounded-lg p-4" />;
                })}
              </>
            ) : (
              <>
                {followings !== null &&
                  followings.map((following) => {
                    return <UserDisplayCard user={following} />;
                  })}
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

export default UserFollowingsDialog;
