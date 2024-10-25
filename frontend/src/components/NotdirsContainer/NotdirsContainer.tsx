type NotdirsContainerProps = {
  children: React.ReactNode;
};

export default function NotdirsContainer({ children }: NotdirsContainerProps) {
  return <ul className="grid grid-cols-3 gap-5">{children}</ul>;
}
