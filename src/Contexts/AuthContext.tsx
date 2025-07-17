import { useAuthUser } from "@/Hooks/useAuthUser";
import type { AuthContextType } from "@/types";
import React, { createContext, useState } from "react";

export const AuthContext = createContext<AuthContextType>({
  loggedInUser: null,
  setLoggedInUser: () => {},
  isLoggedInUserLoading: true,
  isLoginModalOpen: false,
  setIsLoginModalOpen: () => {},
});

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { authUser, isLoading, setAuthUser } = useAuthUser();
  const [isShowLoginModal, setIsShowLoginModal] = useState<boolean>(false);

  console.log("Auth User :- ", authUser);

  return (
    <>
      <AuthContext.Provider
        value={{
          loggedInUser: authUser,
          setLoggedInUser: setAuthUser,
          isLoggedInUserLoading: isLoading,
          isLoginModalOpen: isShowLoginModal,
          setIsLoginModalOpen: setIsShowLoginModal,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};
