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
      <div className="flex gap-2 mt-10 w-full px-10 items-center max-w-lg">
        <div className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-700" />
        <p className="text-sm text-gray-400 dark:text-gray-500">
          or sign in using
        </p>
        <div className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="flex gap-6 mt-6 flex-wrap justify-center">
        {options.map((option) => (
          <Button
            key={option.name}
            variant="outline"
            onClick={() => signIn(`${option.name}`)}
            className="w-[8rem] md:w-[10rem] h-[3rem] text-lg capitalize active:scale-95"
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
