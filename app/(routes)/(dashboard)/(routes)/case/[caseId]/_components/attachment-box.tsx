import { Attachment } from "@prisma/client";
import Link from "next/link";

interface AttachmentBoxProps {
  data: Attachment;
}

export default function AttachmentBox({ data }: AttachmentBoxProps) {
  return (
    <a
      href={data.url}
      target="_blank"
      className="select-none rounded-md bg-sky-200/50 py-1 text-center"
    >
      <span className="text-xs">Click to open</span>{" "}
      <span className="text-sky-600">{data.name}</span>{" "}
      <span className="text-xs">file</span>
    </a>
  );
}
