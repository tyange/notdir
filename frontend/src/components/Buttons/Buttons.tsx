import classNames from "classnames";
import { usePathSegment } from "../../hooks/usePathSegment";

type PathCondition = {
  path: string;
  handler: () => void;
  condition?: () => boolean;
  disabled?: () => boolean;
};

type ButtonProps = {
  text: string;
  visiblePaths: PathCondition[];
};

export type ButtonsProps = {
  buttons: ButtonProps[];
};

export default function Buttons({ buttons }: ButtonsProps) {
  const currentPath = usePathSegment();

  const buttonClassName = (props: ButtonProps) => {
    const baseClassNames = classNames("btn", "join-item");
    const visiblePath = props.visiblePaths.find(
      (vp) => vp.path === currentPath
    );

    if (visiblePath) {
      return visiblePath.disabled
        ? classNames(baseClassNames, { "btn-disabled": visiblePath.disabled() })
        : baseClassNames;
    }

    return baseClassNames;
  };

  const isButtonVisible = (props: ButtonProps) => {
    const pathCondition = props.visiblePaths.find(
      (condition) => condition.path === currentPath
    );

    if (!pathCondition) {
      return false;
    }

    return pathCondition.condition ? pathCondition.condition() : true;
  };

  const buttonHandler = (props: ButtonProps) => {
    return props.visiblePaths.find((vp) => vp.path === currentPath)?.handler;
  };

  return (
    <div className="join flex-1 flex p-5 absolute -top-20 -left-5">
      {buttons.filter(isButtonVisible).map((button) => (
        <button
          key={button.text}
          className={buttonClassName(button)}
          onClick={buttonHandler(button)}
        >
          {button.text}
        </button>
      ))}
    </div>
  );
}
