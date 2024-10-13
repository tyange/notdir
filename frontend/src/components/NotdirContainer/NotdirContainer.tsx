import { main } from "../../../wailsjs/go/models";

type NotdirContainerProps = {
  notdir: main.Notdir;
};

export default function NotdirContainer({ notdir }: NotdirContainerProps) {
  return (
    <div>
      <div>
        <span>{notdir.Name}</span>
      </div>
      <div>
        <ul>
          {notdir.Files.map((file) => (
            <li key={file.Id}>{file.Name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
