import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOutUserSuccess } from "../redux/users/userSlice";
import { useState } from "react";
import { FaBars, FaTimes, FaHome, FaUser, FaStar, FaPlus, FaCompass, FaSignOutAlt } from "react-icons/fa";

const navItems = [
  { path: "/dashboard/explore", label: "Explore", icon: <FaCompass /> },
  { path: "/dashboard/features", label: "Featured", icon: <FaStar /> },
  { path: "/dashboard/landlord", label: "List Property", icon: <FaPlus /> },
  { path: "/dashboard/profile", label: "Profile", icon: <FaUser /> },
];

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await fetch("/server/auth/signout", { credentials: "include" });
    } catch {}
    dispatch(signOutUserSuccess());
    navigate("/sign-in");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar Toggle (mobile) */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-purple-600 text-white rounded-xl shadow-lg lg:hidden"
      >
        {isSidebarOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-60 bg-white border-r border-gray-200 z-40 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} flex flex-col shadow-lg lg:shadow-none`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
              <FaHome className="text-white" size={14} />
            </div>
            <span className="font-extrabold text-gray-800">Basha Lagbe?</span>
          </Link>
        </div>

        {/* User Info */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.username}
              className="w-10 h-10 rounded-full object-cover bg-gray-200"
              onError={(e) => { e.target.src = "https://t4.ftcdn.net/jpg/05/09/59/75/240_F_509597532_RKUuYsERhODmkxkZd82pSHnFtDAtgbzJ.jpg"; }}
            />
            <div className="overflow-hidden">
              <p className="font-semibold text-gray-800 text-sm truncate">{currentUser?.username}</p>
              <p className="text-gray-400 text-xs truncate">{currentUser?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-purple-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"}`}
              >
                <span className={isActive ? "text-white" : "text-gray-400"}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition"
          >
            <FaSignOutAlt className="text-gray-400" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
