import CreatePost from "@/components/CreatePost";
import PublicPostsFeed from "@/components/PublicPostsFeed";
import UserPostsFeed from "@/components/UserPostsFeed";
import { AuthContext } from "@/Contexts/AuthContext";
import { Loader } from "lucide-react";
import { useContext, useState } from "react";

const HomePage = () => {
  const { isLoggedInUserLoading, loggedInUser } = useContext(AuthContext);
  const [refetchPostsFlag, setRefetchPostsFlag] = useState<boolean>(false);

  if (isLoggedInUserLoading) {
    return (
      <>
        <div className="flex items-center justify-center mt-24">
          <Loader />
        </div>
      </>
    );
  }

  return (
    <>
      <div>
        {loggedInUser !== null && (
          <CreatePost setRefetchPostsFlag={setRefetchPostsFlag} />
        )}
        {loggedInUser !== null ? (
          <UserPostsFeed
            refetchPostsFlag={refetchPostsFlag}
            setRefetchPostsFlag={setRefetchPostsFlag}
          />
        ) : (
          <PublicPostsFeed />
        )}
      </div>
    </>
  );
};

export default HomePage;
