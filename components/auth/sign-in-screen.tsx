"use client";

import { useCallback, useMemo, useState } from "react";

import RegisterForm from "@/components/auth/register-form";
import SignInOptions from "@/components/auth/sign-in-options";
import LoginForm from "./login-form";

export default function SignInScreen() {
  const [module, setModule] = useState<"SIGNIN" | "REGISTER">("SIGNIN");

  const prompt = useMemo(() => {
    if (module === "SIGNIN") return { pretext: "New here?", link: "Register" };
    return { pretext: "Already have an account?", link: "Sign In" };
  }, [module]);

  const toggleModule = useCallback(() => {
    if (module === "SIGNIN") return setModule("REGISTER");
    setModule("SIGNIN");
  }, [module]);

  return (
    <>
      <p className="text-gray-600 dark:text-gray-400">
        {prompt.pretext}{" "}
        <span onClick={toggleModule} className="cursor-pointer underline">
          {prompt.link}
        </span>
      </p>
      {module === "REGISTER" && <RegisterForm />}
      {module === "SIGNIN" && (
        <>
          <LoginForm />
          <SignInOptions />
        </>
      )}
    </>
  );
}
