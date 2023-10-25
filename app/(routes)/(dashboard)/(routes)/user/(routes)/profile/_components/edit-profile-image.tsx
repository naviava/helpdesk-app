"use client";

import { useImageModal } from "@/hooks/use-image-modal";
import { useUploadModal } from "@/hooks/use-upload-modal";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { serverClient } from "@/app/_trpc/server-client";
import { useCallback } from "react";

interface EditProfileImageProps {
  user: Awaited<ReturnType<(typeof serverClient)["user"]["getUserProfile"]>>;
}

export default function EditProfileImage({ user }: EditProfileImageProps) {
  const { onOpen: openImageModal } = useImageModal();
  const {
    onOpen: openUploadModal,
    setSingleFile,
    setImageUrl,
  } = useUploadModal();

  const handleViewImage = useCallback(() => {
    if (!user?.image) return;
    openImageModal(user.image);
  }, [user?.image, openImageModal]);

  const handleUploadNew = useCallback(() => {
    setSingleFile(true);
    if (!!user?.image) setImageUrl(user.image);
    openUploadModal();
  }, [setSingleFile, openUploadModal, setImageUrl, user?.image]);

  return (
    <section className="p-6 md:p-8 lg:pl-10">
      <div className="flex items-center gap-x-6 md:gap-x-8">
        <Avatar
          role="button"
          onClick={handleViewImage}
          className="h-24 w-24 rounded-lg md:h-28 md:w-28"
        >
          <AvatarImage src={user?.image || ""} alt="User profile image" />
          <AvatarFallback className="bg-slate-300 text-5xl font-medium dark:bg-slate-700 md:text-6xl">
            {user?.name?.[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <Button variant="outline" size="sm" onClick={handleUploadNew}>
            Upload new photo
          </Button>
          <div className="text-xs text-muted-foreground lg:text-sm">
            <p>Max. file size: 1 MB</p>
            <p>JPG or PNG is allowed</p>
          </div>
        </div>
      </div>
    </section>
  );
}
