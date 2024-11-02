import { createBrowserRouter, NavLink, RouterProvider } from "react-router-dom";

import MainLayout from "./components/Layout/MainLayout";
import NotdirDetailPage from "./pages/NotdirDetailPage";
import NotdirListPage from "./pages/NotdirListPage";
import NewPage from "./pages/NewPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <NotdirListPage />,
        },
        {
          path: "notdir/:id",
          element: <NotdirDetailPage />,
        },
      ],
    },
    {
      path: "new",
      element: <NewPage />,
    },
  ]);

  return (
    <div id="App">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </div>
  );
}
