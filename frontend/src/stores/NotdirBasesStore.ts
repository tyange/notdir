import { makeAutoObservable } from "mobx";

import { main } from "../../wailsjs/go/models";

class NotdirBasesStore {
  isEdit = false;
  notdirBases: main.NotdirBase[] = [];
  initialNotdirBases: main.NotdirBase[] = [];
  removingNotdirBaseIds: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setIsEdit(isEdit: boolean) {
    this.isEdit = isEdit;
  }

  setNotdirBases(notdirBases: main.NotdirBase[]) {
    this.notdirBases = notdirBases;
    this.initialNotdirBases = notdirBases;
  }

  addNotdirBase(notdir: main.Notdir) {
    const newNotdir = new main.NotdirBase({
      Id: notdir.Id,
      Name: notdir.Name,
      Path: notdir.Path,
    });

    this.notdirBases.push(newNotdir);
    this.initialNotdirBases.push(newNotdir);
  }

  getNotdirBaseById(notdirId: string) {
    return this.notdirBases.find((page) => page.Id === notdirId);
  }

  updateNotdirBases(notdirBases: main.NotdirBase[]) {
    this.notdirBases = [...notdirBases];
  }

  get notdirBaseCount() {
    return this.notdirBases.length;
  }
}

// 싱글톤 인스턴스 생성
export const notdirsBasesStore = new NotdirBasesStore();
