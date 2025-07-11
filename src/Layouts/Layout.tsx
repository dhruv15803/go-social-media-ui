import Navbar from "@/components/Navbar";
import { Outlet } from "react-router";

const Layout = () => {
  return (
    <>
      <div className="max-w-md mx-auto">
        <div className="min-h-screen">
          <Outlet />
        </div>
        <Navbar />
      </div>
    </>
  );
};

export default Layout;
