import FollowRequestsRecieved from "@/components/FollowRequestsRecieved";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserNotifications from "@/components/UserNotifications";

const NotificationsPage = () => {
  return (
    <>
      <header className="flex items-center justify-start p-4 border-b-2 gap-2">
        <h1 className="font-semibold">Notifications</h1>
      </header>
      <Tabs defaultValue="notifications">
        <div className="flex items-center justify-center w-full">
          <TabsList className="w-full">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="follow_requests">Follow Requests</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="notifications">
          <UserNotifications />
        </TabsContent>
        <TabsContent value="follow_requests">
          <FollowRequestsRecieved />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default NotificationsPage;
