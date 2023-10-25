import { Separator } from "@/components/ui/separator";
import EditProfileImage from "./edit-profile-image";
import PersonalInfo from "./personal-info";
import PersonalBio from "./personal-bio";

import { serverClient } from "@/app/_trpc/server-client";
import z from "zod";

interface ProfileCardProps {
  user: Awaited<ReturnType<(typeof serverClient)["user"]["getUserProfile"]>>;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Name cannot be empty" }),
  designation: z.string().nullish(),
  departmentId: z.string().nullish(),
  dob: z
    .string()
    .regex(
      /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}|^$/,
      "Enter the required date format",
    ),
  phoneNumber: z
    .string()
    .regex(
      /^(?![- ])(?!.*[- ]$)(?!.*[- ]{2,})[0-9 -]*$/,
      "ex. 413-203... or 413 203...",
    ),
});

export default function ProfileCard({ user }: ProfileCardProps) {
  return (
    <>
      <EditProfileImage user={user} />
      <Separator />
      <PersonalInfo />
      <Separator />
      <PersonalBio />
    </>
  );
}
