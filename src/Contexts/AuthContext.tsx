import { useAuthUser } from "@/Hooks/useAuthUser";
import type { AuthContextType } from "@/types";
import React, { createContext } from "react";

export const AuthContext = createContext<AuthContextType>({
  loggedInUser: null,
  setLoggedInUser: () => {},
  isLoggedInUserLoading: true,
});

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { authUser, isLoading, setAuthUser } = useAuthUser();

  console.log("Auth User :- ", authUser);

  return (
    <>
      <AuthContext.Provider
        value={{
          loggedInUser: authUser,
          setLoggedInUser: setAuthUser,
          isLoggedInUserLoading: isLoading,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};
