import { useState } from "react";
import axios from "axios";
import { ChatState } from "../context/ChatProvider";
import { toast } from "react-toastify";

const GroupChatModal = ({ open, onClose }) => {
  const { user, chats, setChats } = ChatState();

  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  if (!open) return null;

  // 🔍 Search users
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      const { data } = await axios.get(
        `http://localhost:4000/api/user?search=${query}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setSearchResult(data);
    } catch (error) {
      toast.error("Failed to search users");
    }
  };

  // ➕ Add user to group (FIXED LOGIC)
  const handleAddUser = (userToAdd) => {
    if (userToAdd._id === user._id) {
      toast.error("You cannot add yourself");
      return;
    }

    if (selectedUsers.find((u) => u._id === userToAdd._id)) {
      toast.error("User already added");
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  // ❌ Remove selected user
  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== userId));
  };

  // ✅ Create group chat
  const handleSubmit = async () => {
    if (!groupName || selectedUsers.length < 2) {
      toast.error("Group name & at least 2 users required");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/chat/group",
        {
          name: groupName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setChats([data, ...chats]);
      toast.success("Group chat created");
      handleClose();
    } catch (error) {
      toast.error("Failed to create group");
    }
  };

  // 🔁 Reset modal state on close
  const handleClose = () => {
    setGroupName("");
    setSearch("");
    setSearchResult([]);
    setSelectedUsers([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[400px] rounded-lg p-6 relative">
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-4 text-center">
          Create Group Chat
        </h2>

        {/* Group Name */}
        <input
          placeholder="Chat Name"
          className="w-full border px-3 py-2 rounded mb-3"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />

        {/* Search Users */}
        <input
          placeholder="Add Users eg: John, Piyush"
          className="w-full border px-3 py-2 rounded mb-3"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />

        {/* Selected Users */}
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedUsers.map((u) => (
            <span
              key={u._id}
              className="bg-primary text-white px-2 py-1 rounded text-sm cursor-pointer"
              onClick={() => handleRemoveUser(u._id)}
            >
              {u.name} ✕
            </span>
          ))}
        </div>

        {/* Search Results */}
        <div className="max-h-32 overflow-y-auto space-y-2">
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

        {/* Create Button */}
        <button
          onClick={handleSubmit}
          className="mt-4 bg-primary text-white px-4 py-2 rounded float-right"
        >
          Create Chat
        </button>
      </div>
    </div>
  );
};

export default GroupChatModal;
