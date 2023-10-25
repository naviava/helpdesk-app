import { LucideIcon } from "lucide-react";
import { UserRole } from "@prisma/client";
import { format } from "date-fns";
import { Skeleton } from "@nextui-org/react";

interface PersonalInfoFieldProps {
  icon: LucideIcon;
  label: string;
  value?: string | Date | UserRole | null;
  isLoading: boolean;
}

export default function PersonalInfoField({
  icon: Icon,
  label,
  value,
  isLoading,
}: PersonalInfoFieldProps) {
  return (
    <li>
      <div className="flex items-center text-slate-700">
        <Icon className="mr-2 h-5 w-5 lg:h-6 lg:w-6" />
        <h4 className="text-xs lg:text-sm">{label}</h4>
      </div>
      <div className="mt-1 line-clamp-1 break-words pl-7 text-sm font-medium lg:pl-8 lg:text-base">
        {value instanceof Date ? (
          <p>{format(new Date(value), "do MMMM")}</p>
        ) : (
          <>
            {isLoading ? (
              <Skeleton className="h-4 w-[70%] rounded-md" />
            ) : (
              <p>{value}</p>
            )}
          </>
        )}
      </div>
    </li>
  );
}
