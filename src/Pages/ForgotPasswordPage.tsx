import { API_URL } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState } from "react";

const ForgotPasswordPage = () => {
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState<string>("");
  const [isForgotPasswordEmailSent, setIsForgotPasswordEmailSent] =
    useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const response = await axios.post<{ success: boolean; message: string }>(
        `${API_URL}/api/auth/forgot-password`,
        {
          email: forgotPasswordEmail,
        }
      );
      setIsForgotPasswordEmailSent(response.data.success);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          (error.response?.data as { success: boolean; message: string })
            .message
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isForgotPasswordEmailSent && forgotPasswordEmail !== "") {
    return (
      <>
        <div className="flex items-center justify-center mt-24">
          Reset password link sent to{" "}
          <span className="font-semibold">{forgotPasswordEmail}</span>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col mt-8 mx-4">
        <h1 className="text-teal-500 font-semibold text-xl">Forgot Password</h1>

        <form
          onSubmit={(e) => handleSubmit(e)}
          className="flex flex-col w-full gap-2 my-2"
        >
          <Input
            type="email"
            value={forgotPasswordEmail}
            onChange={(e) => setForgotPasswordEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <Button
            disabled={isSubmitting || forgotPasswordEmail.trim() === ""}
            className="bg-teal-500 text-white hover:bg-teal-600 hover:duration-300"
          >
            Submit
          </Button>
        </form>
        {error !== "" && <p className="text-red-500">{error}</p>}
        <p className="font-normal italic">
          You will get a reset password link on your email{" "}
        </p>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
