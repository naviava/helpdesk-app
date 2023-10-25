import { serverClient } from "@/app/_trpc/server-client";
import ProfileCard from "./_components/profile-card";
import ProfileCompletion from "./_components/profile-completion";

export default async function UserProfilePage() {
  const user = await serverClient.user.getUserProfile();

  return (
    <div className="md:flex md:justify-center">
      <article className="mx-2 mt-4 h-fit max-w-5xl rounded-2xl border border-neutral-200 bg-white md:mx-4 md:w-full">
        <ProfileCard user={user} />
      </article>
      <article className="mr-4 mt-4 hidden h-fit w-[17rem] flex-shrink-0 rounded-2xl border border-neutral-200 bg-white lg:block">
        <ProfileCompletion />
      </article>
    </div>
  );
}
