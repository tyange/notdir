type PagesContainerProps = {
  children: React.ReactNode;
};

export default function PagesContainer({ children }: PagesContainerProps) {
  return <ul className="grid grid-cols-3 gap-5">{children}</ul>;
}
