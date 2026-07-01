import { NavLink } from "react-router-dom";
import { useAppStore } from "../../stores/useAppStore";
import "./Sidebar.css";

export default function Sidebar() {
  const isSidebarOpen = useAppStore((state) => state.isSidebarOpen);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        {isSidebarOpen ? <h2>Streambox</h2> : <h2>SB</h2>}
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Home
        </NavLink>
        <NavLink to="/search" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Search
        </NavLink>
        <NavLink to="/library" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Library
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Settings
        </NavLink>
      </nav>
    </aside>
  );
}
