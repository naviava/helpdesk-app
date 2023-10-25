import { create } from "zustand";

type ImageModalStore = {
  url: string;
  isOpen: boolean;
  onOpen: (url: string) => void;
  onClose: () => void;
};

export const useImageModal = create<ImageModalStore>((set) => ({
  url: "",
  isOpen: false,
  onOpen: (url: string) => set({ isOpen: true, url }),
  onClose: () => set({ isOpen: false, url: "" }),
}));
