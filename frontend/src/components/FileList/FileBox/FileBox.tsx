import { useState, useEffect } from "react";

import { main } from "../../../../wailsjs/go/models";
import { FileExists, FileOpen } from "../../../../wailsjs/go/main/App";

type FileBoxProps = {
  file: main.FileInfo;
};

export default function FileBox({ file }: FileBoxProps) {
  const [isFileExists, setIsFileExists] = useState(false);

  const onDoubleClickHandler = async (path: string) => {
    await FileOpen(path);
  };

  useEffect(() => {
    async function checkFileExists() {
      try {
        const exists = await FileExists(file.Path);
        console.log(exists);
        setIsFileExists(exists);
      } catch (error) {
        console.error("파일 확인 중 오류 발생:", error);
        setIsFileExists(false);
      }
    }

    checkFileExists();
  }, [file]);

  return (
    <div
      className="shadow-sm active:shadow-md rounded-lg w-full p-3 border border-gray-300 active:border-gray-400 hover:bg-gray-100 flex items-center gap-2"
      onDoubleClick={() => onDoubleClickHandler(file.Path)}
    >
      {!isFileExists && (
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="red"
            className="size-5"
          >
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </span>
      )}
      <span className="flex-1">{file.Name}</span>
    </div>
  );
}
