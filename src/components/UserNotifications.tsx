import { useMyNotifications } from "@/Hooks/useMyNotifications";
import { Skeleton } from "./ui/skeleton";
import Pagination from "./Pagination";
import { NOTIFICATIONS_PER_PAGE } from "@/consts";
import NotificationCard from "./NotificationCard";
import { useState } from "react";

const UserNotifications = () => {
  const [page, setPage] = useState(1);
  const {
    isLoading: isNotificationsLoading,
    noOfPages,
    notifications,
  } = useMyNotifications(page, NOTIFICATIONS_PER_PAGE);

  if (isNotificationsLoading) {
    return (
      <>
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((val) => {
            return (
              <Skeleton key={val} className="rounded-lg p-4 w-full h-16" />
            );
          })}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {notifications !== null && (
          <>
            {notifications.map((notification, idx) => {
              return <NotificationCard key={idx} notification={notification} />;
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

        {(notifications === null || notifications.length === 0) && (
          <>
            <div className="flex items-center justify-center mt-12 font-semibold">
              No notifications
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default UserNotifications;
