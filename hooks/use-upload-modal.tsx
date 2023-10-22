import { create } from "zustand";

type UploadModalStore = {
  urlList: string[];
  addToUrlList: (url: string) => void;
  clearUrlList: () => void;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useUploadModal = create<UploadModalStore>((set) => ({
  urlList: [],
  addToUrlList: (url: string) =>
    set((state) => ({ urlList: [...state.urlList, url] })),
  clearUrlList: () => set({ urlList: [] }),

  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
