import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Homepage from "./routes/Homepage";
import LoginPage from "./routes/LoginPage";
import RegisterPage from "./routes/RegisterPage";
import SinglePostPage from "./routes/SinglePostPage";
import PostListPage from "./routes/PostListPage";
import Write from "./routes/Write";
import NotFoundPage from "./routes/404Page";
import MainLayout from "./layouts/MainLayout";
import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

const queryClient = new QueryClient();

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Homepage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/posts", element: <PostListPage /> },
      { path: "/:slug", element: <SinglePostPage /> },
      { path: "/write", element: <Write /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ToastContainer position="bottom-right" />
      </QueryClientProvider>
    </ClerkProvider>
  </StrictMode>
);
