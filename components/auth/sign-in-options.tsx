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
      {options.map((option) => (
        <Button
          key={option.name}
          variant="outline"
          onClick={() => signIn(`${option.name}`)}
          className="w-[8rem] md:w-[10rem] h-[3rem] text-lg capitalize"
        >
          <option.Icon size={20} className="mr-2" />
          {option.name}
        </Button>
      ))}
    </>
  );
}
