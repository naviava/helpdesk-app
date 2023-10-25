"use client";

import { useState } from "react";

import { Edit, X } from "lucide-react";
import { Skeleton } from "@nextui-org/react";

import EditBio from "./input-fields/edit-bio";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { trpc } from "@/app/_trpc/client";

export default function PersonalBio() {
  const [isEditing, setIsEditing] = useState(false);

  const { data: user, isFetching } = trpc.user.getUserProfile.useQuery();

  return (
    <section className="relative p-6 md:p-8 lg:pl-10">
      <h2 className="text-lg font-medium lg:text-xl">Bio</h2>
      {isEditing && <EditBio setIsEditing={setIsEditing} />}
      {!isEditing && (
        <div className="mt-6 break-words">
          {isFetching && (
            <div className="space-y-5 md:space-y-5">
              <Skeleton className="h-3 w-[98%] rounded-md md:h-4" />
              <Skeleton className="h-3 w-full rounded-md md:h-4" />
              <Skeleton className="h-3 w-[96%] rounded-md md:h-4" />
              <Skeleton className="h-3 w-[97%] rounded-md md:h-4" />
              <Skeleton className="h-3 w-[95%] rounded-md md:h-4" />
            </div>
          )}
          {!isFetching && !user?.bio ? (
            <p className="text-center text-xs text-muted-foreground md:text-sm">
              🚧 Bio under construction... Don&apos;t leave it blank, let&apos;s
              give it some personality!
            </p>
          ) : (
            <p className="whitespace-pre-wrap text-sm leading-[1.75rem] md:text-base md:leading-[2rem]">
              {user?.bio}
            </p>
          )}
        </div>
      )}
      {!isFetching && (
        <div
          role="button"
          onClick={() => setIsEditing((prev) => !prev)}
          className="absolute right-5 top-5"
        >
          <TooltipProvider>
            <Tooltip delayDuration={200}>
              <TooltipTrigger className="text-slate-600 transition hover:text-slate-600/80">
                {!isEditing ? <Edit /> : <X />}
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>{!isEditing ? "Edit bio" : "Cancel"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </section>
  );
}
