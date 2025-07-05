import Navbar from "@/components/Navbar";
import { Outlet } from "react-router";

const Layout = () => {
  return (
    <>
      <div className="min-h-screen">
        <Outlet />
      </div>
      <Navbar />
    </>
  );
};

export default Layout;
