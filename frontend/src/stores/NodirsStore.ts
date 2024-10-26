import { makeAutoObservable } from "mobx";

import { main } from "../../wailsjs/go/models";

class NotdirsStore {
  notdirs: main.Notdir[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addNotdir(page: main.Notdir) {
    this.notdirs.push(page);
  }

  // 필요한 경우 추가적인 메서드들
  removeNotdir(pageId: string) {
    this.notdirs = this.notdirs.filter((page) => page.Id !== pageId);
  }

  getNotdirById(pageId: string) {
    return this.notdirs.find((page) => page.Id === pageId);
  }

  updateNotdir(id: string, atomdirs: main.Atomdir[], files: main.FileInfo[]) {
    const updatedNotdirIndex = this.notdirs.findIndex(
      (notdir) => notdir.Id === id
    );

    if (updatedNotdirIndex !== -1) {
      this.notdirs[updatedNotdirIndex].Atomdirs = atomdirs;
      this.notdirs[updatedNotdirIndex].Files = files;
      return;
    }

    alert("update할 Notdir를 찾지 못했습니다.");
  }

  get notdirCount() {
    return this.notdirs.length;
  }
}

// 싱글톤 인스턴스 생성
export const notdirsStore = new NotdirsStore();
