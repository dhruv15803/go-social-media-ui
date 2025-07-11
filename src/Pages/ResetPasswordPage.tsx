import { API_URL } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isPasswordStrong } from "@/utils";
import axios from "axios";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [resetPassword, setResetPassword] = useState<string>("");
  const [isShowResetPassword, setIsShowResetPassword] =
    useState<boolean>(false);
  const [confirmResetPassword, setConfirmResetPassword] = useState<string>("");
  const [isShowConfirmResetPassword, setIsShowConfirmResetPassword] =
    useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const token = searchParams.get("token");

  const handleResetPassword = async () => {
    setError("");

    if (resetPassword.trim() !== confirmResetPassword.trim()) {
      setError("password's do not match");
      return;
    }

    if (!isPasswordStrong(resetPassword)) {
      setError("weak password");
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.put<{ success: boolean; message: string }>(
        `${API_URL}/api/auth/reset-password?token=${token}`,
        {
          password: resetPassword,
        }
      );

      setResetPassword("");
      setConfirmResetPassword("");
      setSuccessMsg("password reset successfully, redirecting to login");

      setTimeout(() => {
        navigate("/signin");
      }, 1500);
    } catch (error) {
      setError("failed to reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (token === null || token === "") {
    navigate("/signin");
  }

  if (successMsg !== "" && !isSubmitting) {
    return (
      <>
        <div className="flex items-center justify-center mt-24 font-semibold">
          {successMsg}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col m-4">
        <h1 className="text-teal-500 text-xl font-semibold">Reset Password</h1>

        <div className="flex flex-col gap-4 mt-24">
          <div className="flex flex-col gap-2">
            <Label htmlFor="resetPassword" className="text-teal-500">
              password
            </Label>
            <div className="flex items-center">
              <Input
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                type={isShowResetPassword ? "text" : "password"}
                name="resetPassword"
                id="resetPassword"
              />
              <button
                className="absolute right-0 mx-6"
                onClick={() => setIsShowResetPassword((prev) => !prev)}
              >
                {!isShowResetPassword ? <EyeIcon /> : <EyeOffIcon />}
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmResetPassword" className="text-teal-500">
              Confirm Password
            </Label>
            <div className="flex items-center">
              <Input
                value={confirmResetPassword}
                onChange={(e) => setConfirmResetPassword(e.target.value)}
                type={isShowConfirmResetPassword ? "text" : "password"}
                name="confirmResetPassword"
                id="confirmResetPassword"
              />
              <button
                className="absolute right-0 mx-6"
                onClick={() => setIsShowConfirmResetPassword((prev) => !prev)}
              >
                {!isShowConfirmResetPassword ? <EyeIcon /> : <EyeOffIcon />}
              </button>
            </div>
          </div>
          {error !== "" && <p className="text-red-500">{error}</p>}
          <Link
            to="/forgot-password"
            className="text-teal-500 font-semibold hover:underline hover:underline-offset-4"
          >
            Retry
          </Link>

          <Button
            disabled={
              isSubmitting ||
              resetPassword.trim() === "" ||
              confirmResetPassword.trim() === ""
            }
            onClick={handleResetPassword}
            className="bg-teal-500 text-white hover:bg-teal-600 hover:duration-300"
          >
            Reset Password
          </Button>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
