"use client";

import { useEffect, useState } from "react";
import UploadModal from "@/components/modals/upload-modal";
import ImageModal from "../modals/image-modal";

export default function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;

  return (
    <>
      <UploadModal />
      <ImageModal />
    </>
  );
}
