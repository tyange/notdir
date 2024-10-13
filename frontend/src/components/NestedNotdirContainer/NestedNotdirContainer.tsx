import { NestedNotdir } from "../../types/NestedNotdir";

type NotdirContainerProps = {
  nestedNotdir: NestedNotdir;
};

export default function NestedNotdirContainer({
  nestedNotdir,
}: NotdirContainerProps) {
  return (
    <div>
      <div>
        <span>{nestedNotdir.name}</span>
      </div>
      <div>
        <ul>
          {nestedNotdir.files.map((file) => (
            <li key={file.Id}>{file.Name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
