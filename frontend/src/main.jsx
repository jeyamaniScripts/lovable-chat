import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RouterProvider } from "react-router-dom";
import router from "../Router.jsx";
import ChatProvider from "./context/ChatProvider.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChatProvider>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </ChatProvider>
  </StrictMode>
);
