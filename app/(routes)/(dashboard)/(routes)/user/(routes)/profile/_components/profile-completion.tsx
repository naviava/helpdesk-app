"use client";

import { useMemo } from "react";

import { v4 as uuid } from "uuid";
import { Skeleton } from "@nextui-org/react";
import { CheckCircle, X } from "lucide-react";

import "react-circular-progressbar/dist/styles.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

import { trpc } from "@/app/_trpc/client";

export default function ProfileCompletion() {
  const { data: user, isFetching } = trpc.user.getUserProfile.useQuery();

  const requiredFields = useMemo(
    () => [
      user?.name,
      user?.image,
      user?.designation,
      user?.department,
      user?.dob,
      user?.phoneNumber,
      user?.bio,
    ],
    [user],
  );

  const totalFields = useMemo(
    () => requiredFields.length,
    [requiredFields.length],
  );
  const completedFields = useMemo(
    () => requiredFields.filter(Boolean).length,
    [requiredFields],
  );
  const completionPercent = useMemo(
    () => Math.floor((completedFields / totalFields) * 100),
    [completedFields, totalFields],
  );

  const listItems = useMemo(
    () => [
      { id: uuid(), label: "Name", value: user?.name },
      { id: uuid(), label: "Set an avatar", value: user?.image },
      { id: uuid(), label: "Write your bio", value: user?.bio },
      { id: uuid(), label: "Designation", value: user?.designation },
      { id: uuid(), label: "Department", value: user?.department },
      { id: uuid(), label: "Birthday", value: user?.dob },
      { id: uuid(), label: "Phone Number", value: user?.phoneNumber },
    ],
    [user],
  );

  return (
    <>
      {isFetching ? (
        <section className="space-y-10 py-10">
          <h2 className="text-center text-xl font-medium">
            Complete your profile
          </h2>
          <div>
            <Skeleton className="mx-auto h-[12rem] w-[12rem] rounded-full" />
          </div>
          <ul className="ml-10 space-y-6">
            {Array(7)
              .fill(null)
              .map((_, idx) => (
                <li key={idx} className="flex items-center">
                  <Skeleton className="mr-4 h-6 w-6 rounded-full" />
                  <Skeleton className="h-6 w-[7rem] rounded-full" />
                </li>
              ))}
          </ul>
        </section>
      ) : (
        <section className="space-y-10 py-10">
          <h2 className="text-center text-xl font-medium">
            Complete your profile
          </h2>
          <div className="rounded-none px-10 font-semibold">
            <CircularProgressbar
              value={completionPercent}
              maxValue={100}
              text={completionPercent !== 100 ? `${completionPercent}%` : "👍"}
              styles={buildStyles({
                textColor: "#031230",
                pathColor: "#1DC14E",
              })}
            />
          </div>
          <ul className="ml-10 space-y-6">
            {listItems.map((item) => (
              <li key={item.id} className="flex items-center">
                {!!item.value ? (
                  <CheckCircle className="mr-4 h-5 w-5 text-emerald-600" />
                ) : (
                  <X className="mr-4 h-5 w-5 text-rose-500" />
                )}
                {item.label}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
