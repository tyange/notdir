import classNames from "classnames";
import { usePathSegment } from "../../hooks/usePathSegment";

type PathCondition = {
  path: string;
  handler: () => void;
  condition?: () => boolean;
  disabled?: () => boolean;
  order?: number; // 순서 필드 추가
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

  const getButtonOrder = (props: ButtonProps) => {
    const visiblePath = props.visiblePaths.find(
      (vp) => vp.path === currentPath
    );
    return visiblePath?.order ?? Infinity; // order가 없으면 맨 뒤로
  };

  const sortButtons = (a: ButtonProps, b: ButtonProps) => {
    const orderA = getButtonOrder(a);
    const orderB = getButtonOrder(b);
    return orderA - orderB;
  };

  return (
    <div className="join flex-1 flex p-5 absolute -top-20 -left-5">
      {buttons
        .filter(isButtonVisible)
        .sort(sortButtons) // 버튼 정렬 추가
        .map((button) => (
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
