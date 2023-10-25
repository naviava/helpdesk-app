import { serverClient } from "@/app/_trpc/server-client";
import ProfileCard from "./_components/profile-card";

export default async function UserProfilePage() {
  const user = await serverClient.user.getUserProfile();

  return (
    <div className="md:flex md:justify-center">
      <article className="mx-2 mt-4 rounded-2xl border border-neutral-200 bg-white md:mx-6 md:ml-4 md:w-full lg:w-[80%]">
        <ProfileCard user={user} />
      </article>
      {/* TODO: Remove height class. */}
      <article className="ml-2 mr-4 mt-4 hidden h-[10rem] rounded-2xl border border-neutral-200 bg-white lg:block">
        TODO: Profile Completion Component
      </article>
    </div>
  );
}
