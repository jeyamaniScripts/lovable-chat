const ProfileMenu = ({ onProfile, onLogout }) => {
  return (
    <div className="absolute right-0 top-12 bg-white border rounded shadow w-40">
      <button
        onClick={onProfile}
        className="w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        My Profile
      </button>
      <button
        onClick={onLogout}
        className="w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        Logout
      </button>
    </div>
  );
};

export default ProfileMenu;
