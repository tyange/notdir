import { makeAutoObservable } from "mobx";
import { isEqual } from "es-toolkit";

import { main } from "../../wailsjs/go/models";

class NotdirDetailStore {
  currentNotdirId: string = "";
  atomdirs: main.Atomdir[] = [];
  files: main.FileInfo[] = [];
  initialAtomdirs: main.Atomdir[] = [];
  initialFiles: main.FileInfo[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setCurrentNotdirId(notdir: main.Notdir) {
    this.currentNotdirId = notdir.Id;
  }

  setCurrentAtomdirs(notdir: main.Notdir) {
    this.atomdirs = notdir.Atomdirs;
    this.initialAtomdirs = [...notdir.Atomdirs];
  }

  setCurrentFiles(notdir: main.Notdir) {
    this.files = notdir.Files;
    this.initialFiles = [...notdir.Files];
  }

  updateAtomdirs(updatedAtomdirs: main.Atomdir[]) {
    this.atomdirs = updatedAtomdirs;
  }

  updateFiles(updatedFiles: main.FileInfo[]) {
    this.files = updatedFiles;
  }

  // Computed values for detecting changes
  get hasAtomdirsChanges() {
    return !isEqual(this.atomdirs, this.initialAtomdirs);
  }

  get hasFilesChanges() {
    return !isEqual(this.files, this.initialFiles);
  }

  get hasAnyChanges() {
    return this.hasAtomdirsChanges || this.hasFilesChanges;
  }

  // Original computed values
  get hasAtomdirs() {
    return this.atomdirs.length > 0;
  }

  get hasFiles() {
    return this.files.length > 0;
  }

  get isEmpty() {
    return !this.hasAtomdirs && !this.hasFiles;
  }

  // Helper methods
  reset() {
    this.currentNotdirId = "";
    this.atomdirs = [];
    this.files = [];
    this.initialAtomdirs = [];
    this.initialFiles = [];
  }
}

export const notdirDetailStore = new NotdirDetailStore();
