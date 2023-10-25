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
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      className={cn(
        "max-w-none -translate-y-[90%] border-none bg-transparent shadow-none md:translate-y-0",
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
