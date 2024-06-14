import { setCookie, getCookie } from "cookies-next";
import { create } from "zustand";

interface UseSidebarStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onOpenChange: (value: boolean) => void;
}

const getInitialState = () => {
  const cookieState = getCookie("isSidebarOpen");
  return {
    isOpen: cookieState === "true",
  };
};

export const useSidebar = create<UseSidebarStore>((set) => ({
  isOpen: getInitialState().isOpen,
  onOpen: () => {
    set({ isOpen: true });
    setCookie("isSidebarOpen", "true");
  },
  onClose: () => {
    set({ isOpen: false });
    setCookie("isSidebarOpen", "false");
  },
  onOpenChange: (value) => {
    set({ isOpen: value });
    setCookie("isSidebarOpen", value.toString());
  },
}));
