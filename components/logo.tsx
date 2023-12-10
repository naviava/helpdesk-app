import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoProps {
  width?: number;
  height?: number;
}

export default function Logo({ width = 40, height = 40 }: LogoProps) {
  return (
    <Image
      src="/logo.svg"
      alt="Logo"
      width={width}
      height={height}
      className="object-cover"
    />
  );
}
