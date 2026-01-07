import { useState } from "react";
import TopBar from "../components/TopBar";
import SideBar from "../components/SideBar";
import ChatArea from "../components/ChatArea";
import SearchDrawer from "../components/SearchDrawer";
import ProfileModal from "../components/ProfileModal";

const ChatPage = () => {
  const [openSearch, setOpenSearch] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  return (
    <div className="h-screen flex flex-col w-[100%]">
      <TopBar
        onSearch={() => setOpenSearch(true)}
        onProfile={() => setOpenProfile(true)}
      />

      <div className="flex flex-1">
        <SideBar />
        <ChatArea />
      </div>

      <SearchDrawer open={openSearch} onClose={() => setOpenSearch(false)} />

      <ProfileModal open={openProfile} onClose={() => setOpenProfile(false)} />
    </div>
  );
};

export default ChatPage;
