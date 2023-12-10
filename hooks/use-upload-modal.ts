import { create } from "zustand";

type UploadModalStore = {
  urlList: string[];
  addToUrlList: (url: string) => void;
  clearUrlList: () => void;

  singleFile: boolean;
  imageUrl: string;
  setImageUrl: (url: string) => void;
  setSingleFile: (newState: boolean) => void;

  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useUploadModal = create<UploadModalStore>((set) => ({
  urlList: [],
  addToUrlList: (url: string) =>
    set((state) => ({ urlList: [...state.urlList, url] })),
  clearUrlList: () => set({ urlList: [] }),

  singleFile: false,
  imageUrl: "",
  setImageUrl: (imageUrl: string) => set({ imageUrl }),
  setSingleFile: (newState: boolean) => set({ singleFile: newState }),

  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false, singleFile: false, imageUrl: "" }),
}));
