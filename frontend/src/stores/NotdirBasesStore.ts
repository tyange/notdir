import { makeAutoObservable } from "mobx";

import { main } from "../../wailsjs/go/models";

class NotdirBasesStore {
  notdirsBases: main.NotdirBase[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setNotdirBases(notdirBases: main.NotdirBase[]) {
    this.notdirsBases = notdirBases;
  }

  addNotdirBase(notdir: main.Notdir) {
    const newNotdir = new main.NotdirBase({
      Id: notdir.Id,
      Name: notdir.Name,
      Path: notdir.Path,
    });

    this.notdirsBases.push(newNotdir);
  }

  removeNotdirBase(notdirId: string) {
    this.notdirsBases = this.notdirsBases.filter(
      (page) => page.Id !== notdirId
    );
  }

  getNotdirBaseById(notdirId: string) {
    return this.notdirsBases.find((page) => page.Id === notdirId);
  }

  get notdirBaseCount() {
    return this.notdirsBases.length;
  }
}

// 싱글톤 인스턴스 생성
export const notdirsBasesStore = new NotdirBasesStore();
