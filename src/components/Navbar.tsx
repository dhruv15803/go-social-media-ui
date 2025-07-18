import { AuthContext } from "@/Contexts/AuthContext";
import type { AuthContextType } from "@/types";
import { BellIcon, HomeIcon, SearchIcon, UserIcon } from "lucide-react";
import { useContext } from "react";
import { NavLink } from "react-router";
import { CiLogin } from "react-icons/ci";

type NavbarLink = {
  icon: any;
  text: string;
  link: string;
};

const Navbar = () => {
  const { loggedInUser } = useContext(AuthContext) as AuthContextType;

  const navbarLinks: NavbarLink[] =
    loggedInUser !== null
      ? [
          {
            icon: <HomeIcon />,
            link: "/",
            text: "Home",
          },
          {
            icon: <BellIcon />,
            link: "/notifications",
            text: "Notifications",
          },
          {
            icon: <SearchIcon />,
            link: "/search",
            text: "Search",
          },
          {
            icon: <UserIcon />,
            link: `/user/${loggedInUser?.id}/profile`,
            text: "Profile",
          },
        ]
      : [
          {
            icon: <HomeIcon />,
            link: "/",
            text: "Home",
          },
          {
            icon: <SearchIcon />,
            link: "/search",
            text: "Search",
          },
          {
            icon: <CiLogin />,
            link: "/signin",
            text: "Sign in",
          },
        ];

  return (
    <>
      <div className="flex items-center justify-between gap-8 sticky bottom-0 z-10 bg-white border-2 rounded-t-lg p-4">
        {navbarLinks.map((navbarLink, idx) => {
          return (
            <NavLink
              to={navbarLink.link}
              key={idx}
              className={({ isActive }) =>
                isActive
                  ? "flex flex-col items-center gap-2 text-teal-500"
                  : "flex flex-col items-center gap-2"
              }
            >
              <button className="text-2xl">{navbarLink.icon}</button>
              <span className="hidden md:inline">{navbarLink.text}</span>
            </NavLink>
          );
        })}
      </div>
    </>
  );
};

export default Navbar;
