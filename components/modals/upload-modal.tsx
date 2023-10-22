"use client";

import { useEffect, useState } from "react";

import { useUploadModal } from "@/hooks/use-upload-modal";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import {
  MultiFileDropzone,
  type FileState,
} from "@/components/multi-file-dropzone";

import { useEdgeStore } from "@/lib/edgestore";

export default function UploadWidgetModal() {
  const { isOpen, onClose, addToUrlList, urlList } = useUploadModal();

  const { edgestore } = useEdgeStore();
  const [fileStates, setFileStates] = useState<FileState[]>([]);

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
                            updateFileProgress(addedFileState.key, "COMPLETE");
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
  );
}
