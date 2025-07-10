import { isPasswordStrong } from "@/utils";
import { useContext, useState } from "react";
import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon, Loader } from "lucide-react";
import axios, { isAxiosError } from "axios";
import { API_URL } from "@/App";
import type { AuthContextType, RegisterUserResponse, User } from "@/types";
import { AuthContext } from "@/Contexts/AuthContext";
import { Link, Navigate } from "react-router-dom";

const registerSchema = z
  .object({
    email: z.string().email(),
    username: z.string().min(3, "username must contain atleast 3 character(s)"),
    password: z
      .string()
      .min(6, "password must contain atleast 6 character(s)")
      .refine((password) => isPasswordStrong(password), {
        message: "password is weak",
      }),
    confirmPassword: z.string(),
    dateOfBirth: z.date(),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "password's do not match",
    path: ["confirmPassword"],
  });

type RegisterFormType = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const { loggedInUser, isLoggedInUserLoading } = useContext(
    AuthContext
  ) as AuthContextType;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<RegisterFormType>({ resolver: zodResolver(registerSchema) });
  const [registeredUser, setRegisteredUser] = useState<User | null>(null);
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] =
    useState<boolean>(false);

  const onSubmit: SubmitHandler<RegisterFormType> = async (data) => {
    const userEmail = data.email.trim().toLowerCase();
    const userUsername = data.username.trim();
    const userPassword = data.password.trim();
    const userDateOfBirth = format(data.dateOfBirth, "yyyy-MM-dd");

    try {
      const response = await axios.post<RegisterUserResponse>(
        `${API_URL}/api/auth/register`,
        {
          email: userEmail,
          username: userUsername,
          password: userPassword,
          date_of_birth: userDateOfBirth,
        },
        {
          withCredentials: true,
        }
      );
      setRegisteredUser(response.data.user);
      reset();
    } catch (error: any) {
      console.log(error);
      if (isAxiosError(error)) {
        setError("root", {
          message: (
            error.response?.data as { success: boolean; message: string }
          ).message,
        });
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

  if (registeredUser !== null) {
    return (
      <>
        <div className="flex flex-row flex-wrap justify-center mt-24 gap-2">
          Check your mail{" "}
          <span className="font-semibold">{registeredUser.email}</span> to
          verify and activate your account
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col border-2 rounded-lg p-4 h-screen">
        <h1 className="text-lg text-teal-400 font-medium text-center">
          Sign Up
        </h1>
        <p className="text-md italic text-teal-400 font-normal text-center">
          Built for connection. Made for you.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col  gap-4 mt-12"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-teal-400">
              Email
            </Label>
            <Input
              {...register("email")}
              name="email"
              id="email"
              type="email"
              placeholder="eg: example@example.com"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>

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
                name="password"
                id="password"
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
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword" className="text-teal-400">
              Confirm Password
            </Label>
            <div className="flex items-center">
              <Input
                {...register("confirmPassword")}
                type={isShowConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm Password"
              />
              <button
                onClick={() => setIsShowConfirmPassword((prev) => !prev)}
                className="absolute right-6"
              >
                {!isShowConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="dateOfBirth" className="text-teal-400">
              Date of Birth
            </Label>

            <Input
              type="date"
              {...register("dateOfBirth", { valueAsDate: true })}
            />

            {errors.dateOfBirth && (
              <p className="text-red-500">{errors.dateOfBirth.message}</p>
            )}
          </div>
          <ul className="mb-2 list-disc mx-4">
            <li className="font-light text-sm text-teal-500">
              Password should contain special, numerical , lowercase and
              uppercase characters
            </li>
          </ul>

          <div className="flex items-center gap-2">
            <span className="text-teal-400 text-md font-normal">
              Already have an account ?
            </span>
            <Link
              to="/signin"
              className="text-teal-400 font-semibold hover:underline hover:underline-offset-4"
            >
              Click here
            </Link>
          </div>

          {errors.root && <p className="text-red-500">{errors.root.message}</p>}

          <Button
            disabled={isSubmitting}
            variant="default"
            className="bg-teal-500 hover:bg-teal-600 hover:duration-300"
          >
            {isSubmitting ? "Signing up..." : "Sign up"}
          </Button>
        </form>
      </div>
    </>
  );
};

export default RegisterPage;
