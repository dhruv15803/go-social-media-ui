import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { EyeIcon, EyeOffIcon, Loader } from "lucide-react";
import { Button } from "./ui/button";
import axios, { isAxiosError } from "axios";
import { API_URL } from "@/App";
import type { AuthContextType, LoginUserResponse } from "@/types";
import { Link, Navigate, useNavigate } from "react-router";
import { AuthContext } from "@/Contexts/AuthContext";

const loginByEmailSchema = z.object({
  email: z.string().email().min(1, "email is required"),
  password: z.string().min(1, "password is required"),
});

type LoginByEmailType = z.infer<typeof loginByEmailSchema>;

const LoginByEmail = () => {
  const navigate = useNavigate();
  const { loggedInUser, isLoggedInUserLoading, setLoggedInUser } = useContext(
    AuthContext
  ) as AuthContextType;
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginByEmailType>({
    resolver: zodResolver(loginByEmailSchema),
  });
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

  const onSubmit: SubmitHandler<LoginByEmailType> = async (data) => {
    const userEmail = data.email.trim().toLowerCase();
    const userPassword = data.password.trim();

    try {
      const response = await axios.post<LoginUserResponse>(
        `${API_URL}/api/auth/login`,
        {
          email: userEmail,
          password: userPassword,
        },
        {
          withCredentials: true,
        }
      );

      reset();
      setLoggedInUser(response.data.user);
      navigate("/");
    } catch (error: any) {
      if (isAxiosError(error)) {
        setError("root", {
          message: (
            error.response?.data as { success: boolean; message: string }
          ).message,
        });
      } else {
        console.log(error);
      }
    }
  };

  if (isLoggedInUserLoading) {
    return (
      <>
        <div className="flex items-center justify-center mt-24">
          <Loader />
        </div>
      </>
    );
  }

  if (!isLoggedInUserLoading && loggedInUser !== null) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="text-teal-400">
            Email
          </Label>
          <Input
            {...register("email")}
            type="email"
            name="email"
            id="email"
            placeholder="eg: example@example.com"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password" className="text-teal-400">
            Password
          </Label>

          <div className="flex items-center">
            <Input
              {...register("password")}
              type={isShowPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Enter Password"
            />
            <button
              onClick={() => setIsShowPassword((prev) => !prev)}
              className="absolute right-6"
            >
              {!isShowPassword ? <EyeIcon /> : <EyeOffIcon />}
            </button>
          </div>

          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center gap-1">
          <span className="text-teal-400 text-md font-normal">
            Don't have an account ?
          </span>
          <Link
            to="/signup"
            className="font-semibold text-teal-400 hover:underline hover:underline-offset-4"
          >
            Click here
          </Link>
        </div>

        <div>
          <Link
            to="/forgot-password"
            className="text-teal-500 hover:underline hover:underline-offset-4"
          >
            Forgot password
          </Link>
        </div>

        {errors.root && <p className="text-red-500">{errors.root.message}</p>}

        <Button
          disabled={isSubmitting}
          variant="default"
          className="bg-teal-500 text-white hover:bg-teal-600 hover:duration-300"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </>
  );
};

export default LoginByEmail;
