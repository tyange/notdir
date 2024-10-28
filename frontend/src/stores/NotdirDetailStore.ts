import { makeAutoObservable, runInAction } from "mobx";
import { isEqual } from "es-toolkit";

import { main } from "../../wailsjs/go/models";

class NotdirDetailStore {
  currentNotdirId = "";
  notdirName = "";
  currentNotdirPath = "";
  atomdirs: main.Atomdir[] = [];
  files: main.FileInfo[] = [];
  initialName = "";
  initialAtomdirs: main.Atomdir[] = [];
  initialFiles: main.FileInfo[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setCurrentNotdirId(id: string) {
    this.currentNotdirId = id;
  }

  setCurrentNotdirName(name: string) {
    this.notdirName = name;
    this.initialName = name;
  }

  setCurrentNotdirPath(path: string) {
    this.currentNotdirPath = path;
  }

  setCurrentNotdirAtomdirs(atomdirs: main.Atomdir[]) {
    this.atomdirs = atomdirs;
    this.initialAtomdirs = [...atomdirs];
  }

  setCurrentNotdirFiles(files: main.FileInfo[]) {
    this.files = files;
    this.initialFiles = [...files];
  }

  setCurrentNotdir(notdir: main.Notdir) {
    runInAction(() => {
      this.currentNotdirId = notdir.Id;
      this.notdirName = notdir.Name;
      this.currentNotdirPath = notdir.Path;
      this.atomdirs = notdir.Atomdirs;
      this.initialAtomdirs = [...notdir.Atomdirs];
      this.files = notdir.Files;
      this.initialFiles = [...notdir.Files];
    });
  }

  updateAtomdirs(updatedAtomdirs: main.Atomdir[]) {
    this.atomdirs = updatedAtomdirs;
  }

  updateFiles(updatedFiles: main.FileInfo[]) {
    this.files = updatedFiles;
  }

  syncWithUpdate() {
    this.initialName = this.notdirName;
    this.initialAtomdirs = [...this.atomdirs];
    this.initialFiles = [...this.files];
  }

  get hasAtomdirsChanges() {
    return !isEqual(this.atomdirs, this.initialAtomdirs);
  }

  get hasFilesChanges() {
    return !isEqual(this.files, this.initialFiles);
  }

  get hasAnyChanges() {
    return this.hasAtomdirsChanges || this.hasFilesChanges;
  }

  get hasAtomdirs() {
    return this.atomdirs.length > 0;
  }

  get hasFiles() {
    return this.files.length > 0;
  }

  get isEmpty() {
    return !this.hasAtomdirs && !this.hasFiles;
  }

  reset() {
    this.currentNotdirId = "";
    this.notdirName = "";
    this.currentNotdirPath = "";
    this.atomdirs = [];
    this.files = [];
    this.initialAtomdirs = [];
    this.initialFiles = [];
  }
}

export const notdirDetailStore = new NotdirDetailStore();
