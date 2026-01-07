import { useEffect } from "react";
import { fetchChatsApi } from "../api/chatApi";
import { ChatState } from "../context/ChatProvider";
import { toast } from "react-toastify";

const SideBar = () => {
  const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();

  // helper for 1-1 chat name
  const getSender = (loggedUser, users) => {
    if (!users || users.length < 2) return "Unknown";
    return users[0]._id === loggedUser._id
      ? users[1].name
      : users[0].name;
  };

  useEffect(() => {
    if (!user) return;

    const fetchChats = async () => {
      try {
        const data = await fetchChatsApi(user.token);
        setChats(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error("Failed to load chats");
      }
    };

    fetchChats();
  }, [user, setChats]);

  return (
    <div className="w-[300px] bg-secondary p-4 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">My Chats</h2>

      {chats.length === 0 && (
        <p className="text-gray-500 text-sm">No chats found</p>
      )}

      <div className="space-y-3">
        {chats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => setSelectedChat(chat)}
            className={`p-3 rounded-lg cursor-pointer transition
              ${
                selectedChat?._id === chat._id
                  ? "bg-primary text-white"
                  : "bg-white hover:bg-primary/10"
              }
            `}
          >
            {/* CHAT NAME */}
            <p className="font-semibold">
              {!chat.isGroupChat
                ? getSender(user, chat.users)
                : chat.chatName}
            </p>

            {/* LATEST MESSAGE (SAFE) */}
            {chat.latestMessage ? (
              <p className="text-sm truncate">
                <b>{chat.latestMessage.sender?.name || "User"}:</b>{" "}
                {chat.latestMessage.content}
              </p>
            ) : (
              <p className="text-sm text-gray-400 italic">
                No messages yet
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
