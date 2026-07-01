import { FormEvent, useState } from "react";
import { Menu, Search as SearchIcon, Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../stores/useAppStore";
import "./Topbar.css";

export default function Topbar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedQuery = query.trim();
    navigate(normalizedQuery ? `/search?q=${encodeURIComponent(normalizedQuery)}` : "/search");
  };

  return (
    <header className="topbar glass-panel">
      <div className="topbar-left">
        <button className="icon-btn menu-btn" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
      </div>

      <form className="topbar-center" role="search" onSubmit={handleSearchSubmit}>
        <div className="search-input-wrapper">
          <SearchIcon size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search movies, shows, genres..." 
            className="search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search media"
          />
        </div>
      </form>

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
