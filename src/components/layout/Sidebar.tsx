import { NavLink } from "react-router-dom";
import { 
  Home, 
  Search, 
  Library, 
  Heart, 
  History, 
  Settings,
  MonitorPlay
} from "lucide-react";
import { useAppStore } from "../../stores/useAppStore";
import "./Sidebar.css";

export default function Sidebar() {
  const isSidebarOpen = useAppStore((state) => state.isSidebarOpen);

  return (
    <aside className={`sidebar ${isSidebarOpen ? "expanded" : "collapsed"} glass-panel`}>
      <div className="sidebar-header">
        <MonitorPlay className="brand-icon" size={28} />
        {isSidebarOpen && <h2 className="brand-text">Streambox</h2>}
      </div>
      
      <nav className="sidebar-nav">
        <div className="nav-section">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            <Home size={22} className="nav-icon" />
            {isSidebarOpen && <span className="nav-label">Home</span>}
          </NavLink>
          <NavLink to="/search" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            <Search size={22} className="nav-icon" />
            {isSidebarOpen && <span className="nav-label">Search</span>}
          </NavLink>
        </div>

        <div className="nav-section-title">
          {isSidebarOpen && <span>My Library</span>}
        </div>
        <div className="nav-section">
          <NavLink to="/library" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            <Library size={22} className="nav-icon" />
            {isSidebarOpen && <span className="nav-label">Library</span>}
          </NavLink>
          <NavLink to="/favorites" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            <Heart size={22} className="nav-icon" />
            {isSidebarOpen && <span className="nav-label">Favorites</span>}
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            <History size={22} className="nav-icon" />
            {isSidebarOpen && <span className="nav-label">History</span>}
          </NavLink>
        </div>
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <Settings size={22} className="nav-icon" />
          {isSidebarOpen && <span className="nav-label">Settings</span>}
        </NavLink>
      </div>
    </aside>
  );
}
