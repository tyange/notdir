import { Notdir } from "../../types/Notdir";

type NotdirContainerProps = {
  notdir: Notdir;
};

export default function NotdirContainer({ notdir }: NotdirContainerProps) {
  return (
    <div>
      <div>
        <span>{notdir.name}</span>
      </div>
      <div>
        <ul>
          {notdir.notdirs.map((nd) => (
            <li key={nd.id}>{nd.name}</li>
          ))}
        </ul>
      </div>
      <div>
        <ul>
          {notdir.files.map((file) => (
            <li key={file.Id}>{file.Name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
