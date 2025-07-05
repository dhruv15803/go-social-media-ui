import { AuthContext } from "@/Contexts/AuthContext";
import type { AuthContextType } from "@/types";
import { Loader } from "lucide-react";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const { loggedInUser, isLoggedInUserLoading } = useContext(
    AuthContext
  ) as AuthContextType;

  if (isLoggedInUserLoading) {
    return (
      <>
        <div className="flex items-center justify-center mt-24">
          <Loader />
        </div>
      </>
    );
  }

  if (loggedInUser === null) return <Navigate to="/signin" />;

  return <Outlet />;
};

export default ProtectedRoute;
