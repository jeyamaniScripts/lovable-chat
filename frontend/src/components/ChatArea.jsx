import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ChatState } from "../context/ChatProvider";
import ManageGroupModal from "./ManageGroupModal";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const ENDPOINT = "http://localhost:4000";

const ChatArea = () => {
  const { selectedChat, user } = ChatState();

  const socketRef = useRef(null); // ✅ FIX
  const selectedChatRef = useRef(null); // for comparison

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [openGroupModal, setOpenGroupModal] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  /* ---------------- SOCKET SETUP ---------------- */
  useEffect(() => {
    if (!user) return;

    socketRef.current = io(ENDPOINT, {
      transports: ["websocket"],
    });

    socketRef.current.emit("setup", user);

    socketRef.current.on("connected", () => {
      console.log("✅ Socket connected");
      setSocketConnected(true);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user]);

  /* ---------------- JOIN CHAT ---------------- */
  useEffect(() => {
    if (!selectedChat || !socketRef.current) return;

    selectedChatRef.current = selectedChat;
    socketRef.current.emit("join chat", selectedChat._id);
  }, [selectedChat]);

  /* ---------------- RECEIVE MESSAGE ---------------- */
  useEffect(() => {
    if (!socketRef.current) return;

    const handler = (newMessage) => {
      if (
        !selectedChatRef.current ||
        selectedChatRef.current._id !== newMessage.chat._id
      ) {
        // notification logic later
      } else {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socketRef.current.on("message received", handler);

    return () => {
      if (socketRef.current) {
        socketRef.current.off("message received", handler);
      }
    };
  }, []);

  /* ---------------- FETCH MESSAGES ---------------- */
  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:4000/api/message/${selectedChat._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setMessages(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  /* ---------------- SEND MESSAGE ---------------- */
  const sendMessage = async (e) => {
    if (e.key !== "Enter" || !newMessage.trim()) return;

    try {
      const content = newMessage;
      setNewMessage("");

      const { data } = await axios.post(
        "http://localhost:4000/api/message",
        {
          content,
          chatId: selectedChat._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessages((prev) => [...prev, data]);
      socketRef.current.emit("new message", data);
    } catch {
      toast.error("Message send failed");
    }
  };

  /* ---------------- UI ---------------- */
  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Click on a user to start chatting
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-100 p-3 rounded-lg">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">
          {selectedChat.isGroupChat
            ? selectedChat.chatName.toUpperCase()
            : "CHAT"}
        </h2>

        {selectedChat.isGroupChat && (
          <button onClick={() => setOpenGroupModal(true)}>👁️</button>
        )}
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto bg-white p-3 rounded">
        {loading ? (
          <p>Loading...</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`mb-3 flex ${
                msg.sender._id === user._id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {msg.sender._id !== user._id && (
                <img
                  src={msg.sender.pic || "https://i.pravatar.cc/40"}
                  className="w-8 h-8 rounded-full"
                />
              )}

              <div className="px-3 py-2 bg-gray-200 rounded-lg">
                {msg.content}
              </div>
            </div>
          ))
        )}
      </div>

      {/* INPUT */}
      <input
        className="mt-3 p-2 border rounded"
        placeholder="Enter a message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={sendMessage}
      />

      <ManageGroupModal
        open={openGroupModal}
        onClose={() => setOpenGroupModal(false)}
      />
    </div>
  );
};

export default ChatArea;
