import { ChatState } from "../context/ChatProvider";

const ProfileModal = ({ open, onClose }) => {
  if (!open) return null;

  const { user } = ChatState();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-[350px] rounded-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-center mb-4">{user.name}</h2>

        <img
          src={user.pic ? user.pic : "https://i.pravatar.cc/150"}
          className="w-28 h-28 rounded-full mx-auto mb-4"
        />

        <p className="text-center text-gray-600">
          Email:
          <br />
          {user.email}
        </p>

        <button
          onClick={onClose}
          className="mt-6 block mx-auto bg-primary text-white px-6 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;
