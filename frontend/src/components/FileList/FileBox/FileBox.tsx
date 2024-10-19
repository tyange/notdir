import { main } from "../../../../wailsjs/go/models";

type FileBoxProps = {
  file: main.FileInfo;
};

export default function FileBox({ file }: FileBoxProps) {
  return (
    <div className="shadow-sm rounded-lg w-full p-3 border border-gray-300">
      <span>{file.Name}</span>
    </div>
  );
}
