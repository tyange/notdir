import NotdirContainer from "../components/NotdirContainer/NotdirContainer";
import { Notdir } from "../types/Notdir";

export default function MainPage() {
  // notdir 확장자를 가진 파일의 데이터를 읽어서 하나의 Notdir(모든 Notdir들을 감싸는 wrapper Notdir)를 받도록 합니다.
  const mockNotdirWrapper: Notdir = {
    id: crypto.randomUUID(),
    name: "mock-notdir",
    files: [],
    notdirs: [],
  };
  return (
    <div>
      <NotdirContainer notdir={mockNotdirWrapper} />
    </div>
  );
}
