"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";
import { Loader } from "lucide-react";

import { useUploadModal } from "@/hooks/use-upload-modal";

import { Button } from "@/components/ui/button";
import { SingleImageDropzone } from "@/components/single-image-dropzone";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import {
  MultiFileDropzone,
  type FileState,
} from "@/components/multi-file-dropzone";

import { trpc } from "@/app/_trpc/client";
import { useEdgeStore } from "@/lib/edgestore";
import { useRouter } from "next/navigation";

export default function UploadWidgetModal() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isOpen, onClose, addToUrlList, urlList, singleFile, imageUrl } =
    useUploadModal();

  const { edgestore } = useEdgeStore();
  const [file, setFile] = useState<File>();
  const [fileStates, setFileStates] = useState<FileState[]>([]);

  const { mutate: handleImageUpload } = trpc.user.setProfileImage.useMutation({
    onError: ({ message }) => toast.error(message),
    onSuccess: () => {
      onClose();
      router.refresh();
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  useEffect(() => {
    if (urlList.length === 0) setFileStates([]);
  }, [urlList.length]);

  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key,
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }

  return (
    <>
      {singleFile ? (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent>
            <DialogHeader className="border-b pb-3">
              <h2 className="text-lg font-medium">Upload image</h2>
            </DialogHeader>
            <div className="flex items-center justify-center">
              <div>
                <SingleImageDropzone
                  width={200}
                  height={200}
                  value={file}
                  onChange={(file) => {
                    setFile(file);
                  }}
                />
                <Button
                  variant="theme"
                  size="sm"
                  disabled={isSubmitting}
                  className="w-full"
                  onClick={async () => {
                    if (!!file) {
                      setIsSubmitting(true);
                      const res = await edgestore.publicFiles.upload({
                        file,
                        options: { replaceTargetUrl: imageUrl },
                        onProgressChange: (progress) => {
                          // you can use this to show a progress bar
                          // console.log(progress);
                        },
                      });
                      // you can run some server action or api here
                      // to add the necessary data to your database
                      handleImageUpload({ url: res.url });
                    }
                  }}
                >
                  {!isSubmitting ? (
                    "Set as profile image"
                  ) : (
                    <Loader className="h-6 w-6 animate-spin" />
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent>
            <DialogHeader className="border-b pb-3">
              <h2 className="text-lg font-medium">Upload files</h2>
            </DialogHeader>
            <div className="flex items-center justify-center">
              <div>
                <MultiFileDropzone
                  value={fileStates}
                  onChange={(files) => {
                    setFileStates(files);
                  }}
                  dropzoneOptions={{ maxFiles: 5 }}
                  onFilesAdded={async (addedFiles) => {
                    setFileStates([...fileStates, ...addedFiles]);
                    await Promise.all(
                      addedFiles.map(async (addedFileState) => {
                        try {
                          const res = await edgestore.publicFiles.upload({
                            file: addedFileState.file,
                            options: { temporary: true },
                            onProgressChange: async (progress) => {
                              updateFileProgress(addedFileState.key, progress);
                              if (progress === 100) {
                                // wait 1 second to set it to complete
                                // so that the user can see the progress bar at 100%
                                await new Promise((resolve) =>
                                  setTimeout(resolve, 1000),
                                );
                                updateFileProgress(
                                  addedFileState.key,
                                  "COMPLETE",
                                );
                              }
                            },
                          });
                          addToUrlList(res.url);
                        } catch (err) {
                          updateFileProgress(addedFileState.key, "ERROR");
                        }
                      }),
                    );
                  }}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
