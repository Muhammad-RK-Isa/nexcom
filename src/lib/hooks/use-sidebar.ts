import { create } from "zustand";

interface UseSidebarStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onOpenChange: (value: boolean) => void;
}

export const useSidebar = create<UseSidebarStore>((set) => ({
  isOpen: true,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  onOpenChange: (value) => set({ isOpen: value }),
}));
