import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// Supports weights 100-900
import "@fontsource-variable/inter";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home.tsx";
import App from "./App.tsx";
import Category from "./pages/Category.tsx";
import SubCategory from "./pages/Subcategory.tsx";
import { AccountContextProvider } from "./components/pages/shared/AccountContext.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home></Home>,
      },
      {
        path: "expense",
        element: <h1>This is from expense</h1>,
      },
      {
        path: "category",
        element: <Category></Category>,
      },
      {
        path: "subcategory",
        element: <SubCategory></SubCategory>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <App /> */}
    <AccountContextProvider>
      <RouterProvider router={router}></RouterProvider>
    </AccountContextProvider>
  </React.StrictMode>
);
