import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { EyeIcon, EyeOffIcon, Loader } from "lucide-react";
import { Button } from "./ui/button";
import axios, { isAxiosError } from "axios";
import type { AuthContextType, LoginUserResponse } from "@/types";
import { API_URL } from "@/App";
import { AuthContext } from "@/Contexts/AuthContext";
import { Link, Navigate, useNavigate } from "react-router";

const loginByUsernameSchema = z.object({
  username: z.string().min(1, "username is required"),
  password: z.string().min(1, "password is required"),
});

type LoginByUsernameType = z.infer<typeof loginByUsernameSchema>;

const LoginByUsername = () => {
  const navigate = useNavigate();
  const { loggedInUser, isLoggedInUserLoading, setLoggedInUser } = useContext(
    AuthContext
  ) as AuthContextType;
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginByUsernameType>({
    resolver: zodResolver(loginByUsernameSchema),
  });
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

  const onSubmit: SubmitHandler<LoginByUsernameType> = async (data) => {
    const userUsername = data.username.trim();
    const userPassword = data.password.trim();

    try {
      const response = await axios.post<LoginUserResponse>(
        `${API_URL}/api/auth/login`,
        {
          username: userUsername,
          password: userPassword,
        },
        {
          withCredentials: true,
        }
      );

      setLoggedInUser(response.data.user);
      reset();
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
          <Label htmlFor="username" className="text-teal-400">
            Username
          </Label>
          <Input
            {...register("username")}
            type="text"
            name="username"
            id="username"
            placeholder="eg: example123"
          />
          {errors.username && (
            <p className="text-red-500">{errors.username.message}</p>
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

export default LoginByUsername;
