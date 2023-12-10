import { LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const iconBadgeVariants = cva("rounded-lg p-1 bg-sky-400 text-white", {
  variants: {
    size: {
      default: "h-6 w-6",
      lg: "h-8 w-8",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

type IconBadgeVariantsProps = VariantProps<typeof iconBadgeVariants>;

interface IconBadgeProps extends IconBadgeVariantsProps {
  icon: LucideIcon;
  className?: string;
}

export default function IconBadge({
  icon: Icon,
  size,
  className,
}: IconBadgeProps) {
  return <Icon className={cn(className, iconBadgeVariants({ size }))} />;
}
