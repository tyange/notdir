import { main } from "../../../wailsjs/go/models";
import FileBox from "./FileBox/FileBox";

type FileListProps = {
  files: main.FileInfo[];
};

export default function FileList({ files }: FileListProps) {
  return (
    <ul className="flex flex-col gap-3 select-none">
      {files.map((file) => (
        <li key={file.Id}>
          <FileBox file={file} />
        </li>
      ))}
    </ul>
  );
}
