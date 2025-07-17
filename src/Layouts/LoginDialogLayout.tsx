import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AuthContext } from "@/Contexts/AuthContext";
import type { AuthContextType } from "@/types";
import { useContext } from "react";
import { useNavigate } from "react-router";

const LoginDialogLayout = ({ children }: { children: React.ReactNode }) => {
  const { isLoginModalOpen, setIsLoginModalOpen } = useContext(
    AuthContext
  ) as AuthContextType;
  const navigate = useNavigate();

  return (
    <>
      {children}
      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <Button
            onClick={() => {
              navigate("/signin");
              setIsLoginModalOpen(false);
            }}
            className="bg-teal-500 text-white hover:bg-teal-600 hover:duration-300"
          >
            Login before using the app
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoginDialogLayout;
