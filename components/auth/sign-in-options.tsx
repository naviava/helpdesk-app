"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

const options = [
  {
    name: "google",
    Icon: FcGoogle,
  },
  {
    name: "github",
    Icon: FaGithub,
  },
];

export default function SignInOptions() {
  return (
    <>
      <div className="mt-10 flex w-full max-w-lg items-center gap-2 px-10">
        <div className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-700" />
        <p className="text-sm text-gray-400 dark:text-gray-500">
          or sign in using
        </p>
        <div className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-6">
        {options.map((option) => (
          <Button
            key={option.name}
            variant="outline"
            onClick={() => signIn(`${option.name}`)}
            className="h-[3rem] w-[8rem] text-lg capitalize hover:bg-slate-200 active:scale-95 dark:hover:bg-accent md:w-[10rem] "
          >
            <option.Icon size={20} className="mr-2" />
            <span className="text-gray-500 dark:text-gray-400">
              {option.name}
            </span>
          </Button>
        ))}
      </div>
    </>
  );
}
