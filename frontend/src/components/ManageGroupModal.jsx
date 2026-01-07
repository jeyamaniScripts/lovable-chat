import { useState } from "react";
import axios from "axios";
import { ChatState } from "../context/ChatProvider";
import { toast } from "react-toastify";

const ManageGroupModal = ({ open, onClose }) => {
  const { selectedChat, user, chats, setChats, setSelectedChat } = ChatState();

  const [groupName, setGroupName] = useState(selectedChat?.chatName || "");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  if (!open || !selectedChat) return null;

  const isAdmin = selectedChat.groupAdmin?._id === user._id;

  // 🔍 search users
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      const { data } = await axios.get(
        `http://localhost:4000/api/user?search=${query}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setSearchResult(data);
    } catch {
      toast.error("Failed to search users");
    }
  };

  // ➕ add user
  const handleAddUser = async (u) => {
    if (!isAdmin) {
      toast.error("Only admin can add users");
      return;
    }

    if (selectedChat.users.find((x) => x._id === u._id)) {
      toast.error("User already in group");
      return;
    }

    try {
      const { data } = await axios.put(
        "http://localhost:4000/api/chat/groupadd",
        {
          chatId: selectedChat._id,
          userId: u._id,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      setSelectedChat(data);
      setChats(chats.map((c) => (c._id === data._id ? data : c)));
    } catch {
      toast.error("Failed to add user");
    }
  };

  // ❌ remove user
  const handleRemove = async (u) => {
    if (!isAdmin && u._id !== user._id) {
      toast.error("Only admin can remove users");
      return;
    }

    try {
      const { data } = await axios.put(
        "http://localhost:4000/api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: u._id,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      u._id === user._id ? setSelectedChat(null) : setSelectedChat(data);
      setChats(chats.map((c) => (c._id === data._id ? data : c)));
      onClose();
    } catch {
      toast.error("Failed to remove user");
    }
  };

  // ✏️ rename group
  const handleRename = async () => {
    if (!groupName) return;

    try {
      const { data } = await axios.put(
        "http://localhost:4000/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupName,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      setSelectedChat(data);
      setChats(chats.map((c) => (c._id === data._id ? data : c)));
      toast.success("Group updated");
    } catch {
      toast.error("Rename failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[400px] rounded-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-center mb-4">
          {selectedChat.chatName}
        </h2>

        {/* Users */}
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedChat.users.map((u) => (
            <span
              key={u._id}
              className="bg-primary text-white px-2 py-1 rounded text-sm cursor-pointer"
              onClick={() => handleRemove(u)}
            >
              {u.name} ✕
            </span>
          ))}
        </div>

        {/* Rename */}
        {isAdmin && (
          <div className="flex gap-2 mb-3">
            <input
              className="flex-1 border px-2 py-1 rounded"
              placeholder="Chat Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <button
              onClick={handleRename}
              className="bg-primary text-white px-3 rounded"
            >
              Update
            </button>
          </div>
        )}

        {/* Add User */}
        {isAdmin && (
          <>
            <input
              placeholder="Add User to group"
              className="w-full border px-2 py-1 rounded mb-2"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />

            <div className="max-h-24 overflow-y-auto space-y-1">
              {searchResult.map((u) => (
                <div
                  key={u._id}
                  onClick={() => handleAddUser(u)}
                  className="bg-gray-100 p-2 rounded cursor-pointer hover:bg-gray-200"
                >
                  {u.name}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Leave */}
        <button
          onClick={() => handleRemove(user)}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded float-right"
        >
          Leave Group
        </button>
      </div>
    </div>
  );
};

export default ManageGroupModal;
