import { useState, useEffect } from "react";
import { match } from "ts-pattern";
import classNames from "classnames";

import { main } from "../../../../wailsjs/go/models";
import { FileExists, FileOpen } from "../../../../wailsjs/go/main/App";

type FileBoxProps = {
  file: main.FileInfo;
  isDragging: boolean;
};

type FileBoxState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success" }
  | { status: "error"; error: string };

export default function FileBox({ file, isDragging }: FileBoxProps) {
  const [state, setState] = useState<FileBoxState>({ status: "idle" });

  const isDisabled = state.status !== "success";

  const onDoubleClickHandler = async (path: string) => {
    if (!isDisabled) {
      await FileOpen(path);
    }
  };

  useEffect(() => {
    async function checkFileExists() {
      setState({ status: "loading" });

      try {
        const exists = await FileExists(file.Path);
        setState(
          exists
            ? { status: "success" }
            : { status: "error", error: "File not found" }
        );
      } catch (error) {
        console.error("파일 확인 중 오류 발생:", error);
        setState({ status: "error", error: "Error checking file" });
      }
    }

    checkFileExists();
  }, [file]);

  const baseClasses = classNames(
    "shadow-sm",
    "rounded-lg",
    "w-full",
    "p-3",
    "border",
    {
      "border-gray-200 text-gray-400 cursor-not-allowed": isDisabled,
      "border-gray-300": !isDisabled,
      "bg-gray-100": isDragging,
      "bg-gray-50": isDisabled && !isDragging,
    }
  );

  return match(state)
    .with({ status: "idle" }, () => (
      <div className={baseClasses}>Initializing...</div>
    ))
    .with({ status: "loading" }, () => (
      <div className={classNames(baseClasses, "flex items-center")}>
        <span className="loading loading-spinner loading-md mr-2"></span>
        <span>Checking file...</span>
      </div>
    ))
    .with({ status: "success" }, () => (
      <div
        className={baseClasses}
        onDoubleClick={() => onDoubleClickHandler(file.Path)}
      >
        <span className="flex-1">{file.Name}</span>
      </div>
    ))
    .with({ status: "error" }, ({ error }) => (
      <div
        className={classNames(
          baseClasses,
          "border-red-300 bg-red-50 text-red-600"
        )}
      >
        Error: {error}
      </div>
    ))
    .exhaustive();
}
