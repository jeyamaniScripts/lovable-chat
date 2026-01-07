import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { ChatState } from "../context/ChatProvider";
import { set } from "date-fns";

const SearchDrawer = ({ open, onClose }) => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:4000/api/user?search=";
  const { user, chats, setChats, setSelectedChat } = ChatState();
  // console.log(user);

  if (!open) return null;

  const handleSearch = async () => {
    if (!search) {
      toast.error("Please type something");
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`${API_URL}${search}`, config);

      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load search results");
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "http://localhost:4000/api/chat",
        { userId },
        config
      );

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);

      onClose();
    } catch (error) {
      toast.error("Error accessing chat");
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-[320px] bg-white p-4">
        <h2 className="text-lg font-semibold mb-3">Search Users</h2>

        <div className="flex gap-2 mb-4">
          <input
            placeholder="Search users..."
            className="flex-1 border px-3 py-2 rounded outline-none focus:border-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="bg-primary text-white px-4 rounded"
            onClick={handleSearch}
          >
            Go
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="space-y-2">
            {searchResult.map((u) => (
              <div
                key={u._id}
                onClick={() => accessChat(u._id)}
                className="bg-gray-100 p-3 rounded cursor-pointer hover:bg-gray-200"
              >
                <p className="font-medium">{u.name}</p>
                <p className="text-sm text-gray-600">Email : {u.email}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchDrawer;
