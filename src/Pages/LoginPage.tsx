import LoginByEmail from "@/components/LoginByEmail";
import LoginByUsername from "@/components/LoginByUsername";
import { useState } from "react";

const LoginPage = () => {
  const [isLoginByEmail, setIsLoginByEmail] = useState<boolean>(true);

  return (
    <>
      <div className="flex flex-col border-2 rounded-lg p-4 h-screen">
        <div>
          <h1 className="text-lg text-teal-400 font-medium text-center">
            Sign In
          </h1>

          <p className="text-md italic text-teal-400 font-normal text-center">
            Built for connection. Made for you.
          </p>
        </div>

        <div className="grid grid-cols-2 mt-6">
          <button
            onClick={() => setIsLoginByEmail(true)}
            className={`border-2 border-teal-500 rounded-l-lg p-2 ${
              isLoginByEmail ? "bg-teal-500 text-white" : "text-teal-500"
            }`}
          >
            Email
          </button>
          <button
            onClick={() => setIsLoginByEmail(false)}
            className={`border-2 border-teal-500 rounded-r-lg p-2 ${
              !isLoginByEmail ? "bg-teal-500 text-white" : "text-teal-500"
            }`}
          >
            Username
          </button>
        </div>

        <div className="mt-6">
          {isLoginByEmail ? <LoginByEmail /> : <LoginByUsername />}
        </div>
      </div>
    </>
  );
};

export default LoginPage;
