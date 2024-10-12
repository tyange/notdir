import DraggableItems from "../components/DraggableItems/DraggableItems";
import { TempNotdir } from "../types/TempNotdir";

type TempNewPageProps = {
  tempNotdir: TempNotdir;
};

export default function TempNewPage({ tempNotdir }: TempNewPageProps) {
  return (
    <div>
      <DraggableItems {...tempNotdir} />
    </div>
  );
}
