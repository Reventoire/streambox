import { useAppStore } from "../../stores/useAppStore";
import "./Topbar.css";

export default function Topbar() {
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);

  return (
    <header className="topbar">
      <button className="menu-btn" onClick={toggleSidebar}>
        ☰
      </button>
      <div className="topbar-actions">
        {/* Placeholder for future actions */}
      </div>
    </header>
  );
}
