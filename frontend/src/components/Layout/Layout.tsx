import Menu from "../Menu/Menu";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col w-full h-screen p-5 mt-14">
      <main className="flex justify-between flex-1 gap-5">
        <Menu />
        <div className="flex-1 relative">{children}</div>
      </main>
    </div>
  );
}
