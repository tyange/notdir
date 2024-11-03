import classNames from "classnames";
import { usePathSegment } from "../../hooks/usePathSegment";

type ButtonProps = {
  text: string;
  handler: () => void;
  visiblePaths: string[];
  disabled: boolean;
};

export type ButtonsProps = {
  buttons: ButtonProps[];
};

export default function Buttons({ buttons }: ButtonsProps) {
  const buttonClassName = (props: ButtonProps) => {
    return classNames("btn", "join-item", { "btn-disabled": props.disabled });
  };

  return (
    <div className="join flex-1 flex p-5 absolute -top-20 -left-5">
      {buttons
        .filter((button) => button.visiblePaths.includes(usePathSegment()))
        .map((button) => (
          <button
            key={button.text}
            className={buttonClassName(button)}
            onClick={button.handler}
          >
            {button.text}
          </button>
        ))}
    </div>
  );
}
