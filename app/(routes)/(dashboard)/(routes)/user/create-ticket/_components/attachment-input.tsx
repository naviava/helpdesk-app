import { UseFormReturn } from "react-hook-form";

interface AttachmentInputProps {
  form: UseFormReturn<
    {
      title: string;
      message: string;
      priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
      category?: string | null | undefined;
      department?: string | null | undefined;
      attachment?: string | null | undefined;
    },
    any,
    undefined
  >;
}

export default function AttachmentInput({ form }: AttachmentInputProps) {
  return <div>AttachmentInput</div>;
}
