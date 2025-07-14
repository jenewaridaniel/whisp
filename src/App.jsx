import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./Navbar/Navbar";
import Privacy from "./pages/Privacy";
import Post from "./Feat/Post";

const ROUTER = {
  HOME: "/",
  PRIVACY: "/privacy",
  POST: "/post",
};

const AppLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [{ path: ROUTER.HOME, element: <Home /> },
      {path: ROUTER.PRIVACY, element:<Privacy />},
      {path: ROUTER.POST, element:<Post />},
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
