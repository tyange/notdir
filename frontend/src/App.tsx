import { createBrowserRouter, NavLink, RouterProvider } from "react-router-dom";
import MainPage from "./pages/MainPage";
import NewPage from "./pages/NewPage";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainPage />,
    },
    {
      path: "new",
      element: <NewPage />,
    },
  ]);

  return (
    <div id="App">
      <RouterProvider router={router} />
    </div>
  );
}
