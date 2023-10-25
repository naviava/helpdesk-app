import { format } from "date-fns";
import { LucideIcon } from "lucide-react";
import { Skeleton } from "@nextui-org/react";

import { UserRole } from "@prisma/client";

interface PersonalInfoFieldProps {
  icon: LucideIcon;
  label: string;
  value?: string | UserRole | null;
  isLoading: boolean;
}

export default function PersonalInfoField({
  icon: Icon,
  label,
  value,
  isLoading,
}: PersonalInfoFieldProps) {
  const displayString =
    label === "Date of Birth"
      ? !!value && format(new Date(value), "LLLL do")
      : value;

  return (
    <li>
      <div className="flex items-center text-slate-700">
        <Icon className="mr-2 h-5 w-5 lg:h-6 lg:w-6" />
        <h4 className="text-xs lg:text-sm">{label}</h4>
      </div>
      <div className="mt-1 line-clamp-1 break-words pl-7 text-sm font-medium lg:pl-8 lg:text-base">
        {isLoading ? (
          <Skeleton className="h-4 w-[70%] rounded-md" />
        ) : (
          <>
            {!!displayString ? (
              <p>{displayString}</p>
            ) : (
              <p className="italic text-slate-400">No Data</p>
            )}
          </>
        )}
      </div>
    </li>
  );
}
