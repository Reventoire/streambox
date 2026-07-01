import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { useAppStore } from "../stores/useAppStore";
import "./AppLayout.css";

export default function AppLayout() {
  const isSidebarOpen = useAppStore((state) => state.isSidebarOpen);

  return (
    <div className={`app-layout ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <Sidebar />
      <div className="main-area">
        <Topbar />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
