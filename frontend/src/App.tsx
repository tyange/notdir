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
    // <div id="App">
    //   <p className="text-red-600">notdir</p>
    //   <nav>
    //     <ul>
    //       <li>
    //         <Link to="/">Main</Link>
    //       </li>
    //       <li>
    //         <Link to="new">New</Link>
    //       </li>
    //     </ul>
    //   </nav>
    //   <main>
    //     <RouterProvider router={router} />
    //   </main>
    // </div>
    <div id="App">
      <RouterProvider router={router} />
    </div>
  );
}
