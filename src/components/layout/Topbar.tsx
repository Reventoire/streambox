import { Menu, Search as SearchIcon, Bell, User } from "lucide-react";
import { useAppStore } from "../../stores/useAppStore";
import "./Topbar.css";

export default function Topbar() {
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);

  return (
    <header className="topbar glass-panel">
      <div className="topbar-left">
        <button className="icon-btn menu-btn" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
      </div>

      <div className="topbar-center">
        <div className="search-input-wrapper">
          <SearchIcon size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search movies, shows, actors..." 
            className="search-input"
          />
        </div>
      </div>

      <div className="topbar-actions">
        <button className="icon-btn">
          <Bell size={20} />
        </button>
        <button className="icon-btn avatar-btn">
          <User size={20} />
        </button>
      </div>
    </header>
  );
}
