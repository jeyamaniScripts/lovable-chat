import { createBrowserRouter } from "react-router-dom";
import App from "./src/App";
import HomePage from "./src/pages/HomePage";
import ChatPage from "./src/pages/ChatPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/chats", element: <ChatPage /> },
    ],
  },
]);

export default router;
