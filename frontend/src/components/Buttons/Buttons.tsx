export type ButtonsProps = {
  buttons: { text: string; handler: () => void; enabled: boolean }[];
};

export default function Buttons({ buttons }: ButtonsProps) {
  return (
    <div className="join flex-1 flex p-5 absolute -top-20 -left-5">
      {buttons
        .filter((button) => button.enabled)
        .map((button) => (
          <button
            key={button.text}
            className="btn join-item"
            onClick={button.handler}
          >
            {button.text}
          </button>
        ))}
    </div>
  );
}
