import { create } from "zustand";
import { main } from "../../wailsjs/go/models";

interface NotdirBasesState {
  isEdit: boolean;
  notdirBases: main.NotdirBase[];
  initialNotdirBases: main.NotdirBase[];
  removingNotdirBaseIds: string[];

  // Actions
  setIsEdit: (isEdit: boolean) => void;
  setNotdirBases: (notdirBases: main.NotdirBase[]) => void;
  addNotdirBase: (notdir: main.Notdir) => void;
  getNotdirBaseById: (notdirId: string) => main.NotdirBase | undefined;
  updateNotdirBases: (notdirBases: main.NotdirBase[]) => void;

  // Computed values
  notdirBaseCount: number;
}

export const useNotdirBasesStore = create<NotdirBasesState>()((set, get) => ({
  // State
  isEdit: false,
  notdirBases: [],
  initialNotdirBases: [],
  removingNotdirBaseIds: [],

  // Actions
  setIsEdit: (isEdit) => set({ isEdit }),

  setNotdirBases: (notdirBases) =>
    set({
      notdirBases,
      initialNotdirBases: notdirBases,
    }),

  addNotdirBase: (notdir) => {
    const newNotdir = new main.NotdirBase({
      Id: notdir.Id,
      Name: notdir.Name,
      Path: notdir.Path,
    });

    set((state) => ({
      notdirBases: [...state.notdirBases, newNotdir],
      initialNotdirBases: [...state.initialNotdirBases, newNotdir],
    }));
  },

  getNotdirBaseById: (notdirId) => {
    return get().notdirBases.find((page) => page.Id === notdirId);
  },

  updateNotdirBases: (notdirBases) => set({ notdirBases: [...notdirBases] }),

  // Computed values (they will be recomputed on each access)
  get notdirBaseCount() {
    return get().notdirBases.length;
  },
}));
