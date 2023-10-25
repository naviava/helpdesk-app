import Image from "next/image";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

import { useImageModal } from "@/hooks/use-image-modal";
import { cn } from "@/lib/utils";
// import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function ImageModal() {
  const { url, isOpen, onClose } = useImageModal();

  const dimensions =
    "h-[350px] w-[350px] md:h-[650px] md:w-[650px] lg:h-[800px] lg:w-[800px]";

  return (
    // <Dialog open={isOpen} onOpenChange={onClose}>
    //   <DialogContent className="h-[800px] max-w-none border-none bg-transparent p-0 md:w-auto">
    //     <div className="relative h-[800px] w-[800px] rounded-lg">
    //       <Image
    //         fill
    //         src={url}
    //         alt="Profile image"
    //         className="rounded-lg object-cover"
    //       />
    //     </div>
    //   </DialogContent>
    // </Dialog>
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      className={cn(
        "max-w-none -translate-y-[90%] border-none bg-transparent md:translate-y-0",
        dimensions,
      )}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody className="p-0">
              <div className={cn("relative rounded-lg", dimensions)}>
                <Image
                  fill
                  src={url}
                  alt="Profile image"
                  className="rounded-lg object-cover"
                />
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
