import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { FaBars, FaTimes, FaHome, FaUsers, FaBuilding, FaChartBar, FaSignOutAlt, FaShieldAlt } from "react-icons/fa";
import { signOutAdminSuccess } from "../redux/admins/adminSlice";

const navItems = [
  { path: "/admin/dashboard", label: "Overview", icon: <FaHome /> },
  { path: "/admin/dashboard/users", label: "Users", icon: <FaUsers /> },
  { path: "/admin/dashboard/properties", label: "Properties", icon: <FaBuilding /> },
  { path: "/admin/dashboard/analytics", label: "Analytics", icon: <FaChartBar /> },
];

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { admin } = useSelector((state) => state.admin);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await fetch("/server/admin/signout", { credentials: "include" });
    } catch {}
    dispatch(signOutAdminSuccess());
    localStorage.removeItem("adminToken");
    navigate("/admin/signin");
  };

  return (
    <div className="flex min-h-screen bg-gray-950">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-800 z-40 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <FaShieldAlt className="text-white" size={16} />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Basha Lagbe</p>
              <p className="text-gray-500 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Admin info */}
        <div className="px-4 py-3 border-b border-gray-800">
          <p className="text-xs text-gray-500 mb-1">Signed in as</p>
          <p className="text-white font-medium text-sm">{admin?.username || "Admin"}</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== "/admin/dashboard" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-purple-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-900/30 hover:text-red-400 transition"
          >
            <FaSignOutAlt />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center gap-4 lg:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-400 hover:text-white"
          >
            {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
          <span className="text-white font-bold">Admin Dashboard</span>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
