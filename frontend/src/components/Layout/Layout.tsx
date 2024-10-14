import Navigation from "../Navigation/Navigation";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
}
