import { create } from "zustand";
import { isEqual } from "es-toolkit";
import { main } from "../../wailsjs/go/models";

interface NotdirDetailState {
  isEdit: boolean;
  currentNotdirId: string;
  notdirName: string;
  currentNotdirPath: string;
  atomdirs: main.Atomdir[];
  files: main.FileInfo[];
  initialName: string;
  initialAtomdirs: main.Atomdir[];
  initialFiles: main.FileInfo[];

  // Actions
  setIsEdit: (isEdit: boolean) => void;
  setCurrentNotdirId: (id: string) => void;
  setCurrentNotdirName: (name: string) => void;
  setCurrentNotdirPath: (path: string) => void;
  setCurrentNotdirAtomdirs: (atomdirs: main.Atomdir[]) => void;
  setCurrentNotdirFiles: (files: main.FileInfo[]) => void;
  setCurrentNotdir: (notdir: main.Notdir) => void;
  updateAtomdirs: (updatedAtomdirs: main.Atomdir[]) => void;
  updateFiles: (updatedFiles: main.FileInfo[]) => void;
  syncWithUpdate: () => void;
  reset: () => void;
}

export const useNotdirDetailStore = create<NotdirDetailState>((set, get) => ({
  // Initial state
  isEdit: false,
  currentNotdirId: "",
  notdirName: "",
  currentNotdirPath: "",
  atomdirs: [],
  files: [],
  initialName: "",
  initialAtomdirs: [],
  initialFiles: [],
  setIsEdit: (isEdit) => set({ isEdit }),
  setCurrentNotdirId: (id) => set({ currentNotdirId: id }),
  setCurrentNotdirName: (name) =>
    set({
      notdirName: name,
      initialName: name,
    }),
  setCurrentNotdirPath: (path) => set({ currentNotdirPath: path }),
  setCurrentNotdirAtomdirs: (atomdirs) =>
    set({
      atomdirs,
      initialAtomdirs: [...atomdirs],
    }),
  setCurrentNotdirFiles: (files) =>
    set({
      files,
      initialFiles: [...files],
    }),
  setCurrentNotdir: (notdir) =>
    set({
      currentNotdirId: notdir.Id,
      notdirName: notdir.Name,
      currentNotdirPath: notdir.Path,
      atomdirs: notdir.Atomdirs,
      initialAtomdirs: [...notdir.Atomdirs],
      files: notdir.Files,
      initialFiles: [...notdir.Files],
    }),
  updateAtomdirs: (updatedAtomdirs) => set({ atomdirs: updatedAtomdirs }),
  updateFiles: (updatedFiles) => set({ files: updatedFiles }),
  syncWithUpdate: () => {
    const state = get();
    set({
      initialName: state.notdirName,
      initialAtomdirs: [...state.atomdirs],
      initialFiles: [...state.files],
    });
  },
  reset: () =>
    set({
      currentNotdirId: "",
      notdirName: "",
      currentNotdirPath: "",
      atomdirs: [],
      files: [],
      initialAtomdirs: [],
      initialFiles: [],
    }),
}));
