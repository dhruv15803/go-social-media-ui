import { API_URL } from "@/App";
import { AuthContext } from "@/Contexts/AuthContext";
import type { AuthContextType, User } from "@/types";
import axios from "axios";
import { Loader } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { setLoggedInUser } = useContext(AuthContext) as AuthContextType;
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string>("");
  const [isActivatingUser, setIsActivatingUser] = useState<boolean>(true);

  const verifyToken = searchParams.get("token");

  useEffect(() => {
    if (verifyToken === null) return;

    const activateUserWithToken = async () => {
      try {
        setIsActivatingUser(true);

        const response = await axios.put<{
          success: boolean;
          message: string;
          user: User | null;
        }>(
          `${API_URL}/api/auth/activate?token=${verifyToken}`,
          {},
          {
            withCredentials: true,
          }
        );

        setLoggedInUser(response.data.user);
        navigate("/");
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          setError(
            (error.response?.data as { success: false; message: string })
              .message
          );
        }
      } finally {
        setIsActivatingUser(false);
      }
    };

    activateUserWithToken();
  }, [verifyToken]);

  return (
    <>
      <div className="flex flex-col mt-24 gap-8">
        <div className="flex items-center justify-center font-semibold">
          Activate your account
        </div>

        {isActivatingUser && (
          <>
            <div className="flex items-center justify-center gap-2">
              <Loader />
              <span>Activating...</span>
            </div>
          </>
        )}

        {!isActivatingUser && error !== "" && (
          <>
            <div className="flex items-center justify-center text-red-500">
              {error}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default VerifyEmail;
