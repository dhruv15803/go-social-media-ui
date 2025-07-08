import { FOLLOW_REQUESTS_PER_PAGE } from "@/consts";
import { useMyFollowRequestsReceived } from "@/Hooks/useMyFollowRequestsReceived";
import React, { useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { UserIcon } from "lucide-react";
import { Button } from "./ui/button";
import Pagination from "./Pagination";
import axios from "axios";
import { API_URL } from "@/App";
import { toast } from "react-toastify";

const FollowRequestsRecieved = () => {
  const [refetchRequestsFlag, setRefetchRequestsFlag] =
    useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const {
    followRequestsReceived,
    isLoading: isRequestsLoading,
    noOfPages,
  } = useMyFollowRequestsReceived(
    page,
    FOLLOW_REQUESTS_PER_PAGE,
    refetchRequestsFlag
  );

  const handleAcceptRequest = async (senderId: number) => {
    try {
      await axios.post(
        `${API_URL}/api/user/${senderId}/follow-request/accept`,
        {},
        {
          withCredentials: true,
        }
      );

      setRefetchRequestsFlag((prev) => !prev);
    } catch (error) {
      toast("failed to accept request");
    }
  };

  if (isRequestsLoading) {
    return (
      <>
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => {
            return <Skeleton key={val} className="rounded-lg p-2 h-16" />;
          })}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {followRequestsReceived !== null && (
          <>
            {followRequestsReceived.map((request, idx) => {
              return (
                <React.Fragment key={request.request_sender_id}>
                  <div
                    key={request.request_sender_id}
                    className={`flex items-center justify-between p-4 border-b-2 ${
                      idx !== followRequestsReceived.length - 1
                        ? "border-b-2"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {request.request_sender.image_url !== null ? (
                        <img
                          className="rounded-full w-12 h-12"
                          src={request.request_sender.image_url}
                        />
                      ) : (
                        <UserIcon />
                      )}
                      <span className="font-semibold">
                        {request.request_sender.username}
                      </span>
                    </div>

                    <Button
                      onClick={() =>
                        handleAcceptRequest(request.request_sender_id)
                      }
                      className="bg-teal-500 text-white"
                    >
                      Accept
                    </Button>
                  </div>
                </React.Fragment>
              );
            })}

            {noOfPages > 1 && (
              <Pagination
                currentPage={page}
                noOfPages={noOfPages}
                setPage={setPage}
              />
            )}
          </>
        )}

        {(followRequestsReceived === null ||
          followRequestsReceived.length === 0) && (
          <>
            <div className="flex items-center justify-center gap-2 my-4 font-semibold">
              No requests
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default FollowRequestsRecieved;
