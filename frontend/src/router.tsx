import { createBrowserRouter } from "react-router-dom";
import Layout from "./pages/Layout";
import Loginpage from "./pages/Loginpage";
import SignupPage from "./pages/SignupPage";
import AdminRoutes from "./pages/AdminRoutes";
import Dashboard from "./pages/Dashboard";
import Readerpage from "./pages/Readerpage";
import BooksPage from "./pages/BookPage";
import LendingPage from "./pages/LendingPage";

const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout/>,
      children: [
        { path: "/", element: <Loginpage/> },
        { path: "/login", element: <Loginpage/> },
        { path: "/signup", element: <SignupPage/> },
        {
          element: <AdminRoutes/>,
          children: [
            { path: "/dashboard", element: <Dashboard /> },
            { path: "/dashboard/readers", element: <Readerpage /> },
            { path: "/dashboard/books", element: <BooksPage /> },
            { path: "/dashboard/lendings", element: <LendingPage /> },
           
          ],
        },
      ],
    },
  ])
  

  export default router