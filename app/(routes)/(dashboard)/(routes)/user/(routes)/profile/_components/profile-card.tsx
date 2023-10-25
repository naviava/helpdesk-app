import { Separator } from "@/components/ui/separator";
import EditProfileImage from "./edit-profile-image";
import PersonalInfo from "./personal-info";

import { serverClient } from "@/app/_trpc/server-client";

interface ProfileCardProps {
  user: Awaited<ReturnType<(typeof serverClient)["user"]["getUserProfile"]>>;
}

export default function ProfileCard({ user }: ProfileCardProps) {
  return (
    <>
      <EditProfileImage user={user} />
      <Separator />
      <PersonalInfo />
    </>
  );
}
