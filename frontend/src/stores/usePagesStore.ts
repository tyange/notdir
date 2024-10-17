import { create } from "zustand";
import { main } from "../../wailsjs/go/models";

type PagesStore = {
  pages: main.Page[];
  addPage: (page: main.Page) => void;
};

export const usePagesStore = create<PagesStore>((set) => ({
  pages: [],
  addPage: (page) =>
    set((state) => {
      const updatedPages = [...state.pages];
      updatedPages.push(page);
      return {
        ...state,
        pages: updatedPages,
      };
    }),
}));
