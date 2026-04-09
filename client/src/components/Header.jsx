import { useState } from "react";
import { FaSearch, FaBars, FaTimes, FaUserCircle, FaHome, FaCompass } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signOutUserSuccess } from "../redux/users/userSlice";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) navigate(`/dashboard/explore?search=${searchTerm}`);
  };

  const handleSignOut = async () => {
    try {
      await fetch("/server/auth/signout", { credentials: "include" });
    } catch {}
    dispatch(signOutUserSuccess());
    navigate("/sign-in");
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
            <FaHome className="text-white" size={14} />
          </div>
          <div className="hidden sm:block">
            <span className="font-extrabold text-gray-800">Basha</span>
            <span className="font-extrabold text-purple-600"> Lagbe?</span>
          </div>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
          <FaSearch className="text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent focus:outline-none text-gray-700 text-sm flex-1 placeholder-gray-400"
          />
        </form>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link to="/" className="px-3 py-2 text-gray-600 hover:text-purple-600 text-sm font-medium rounded-lg hover:bg-purple-50 transition">
            Home
          </Link>
          <Link to="/about" className="px-3 py-2 text-gray-600 hover:text-purple-600 text-sm font-medium rounded-lg hover:bg-purple-50 transition">
            About
          </Link>
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.username}
                  className="w-8 h-8 rounded-full object-cover"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
                <span className="text-sm font-medium text-gray-700">{currentUser.username}</span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
                  <Link to="/dashboard/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <FaUserCircle size={14} className="text-purple-400" /> My Profile
                  </Link>
                  <Link to="/dashboard/explore" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <FaCompass size={14} className="text-purple-400" /> Explore
                  </Link>
                  <hr className="my-1 border-gray-100" />
                  <button onClick={handleSignOut} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2 ml-2">
              <Link to="/sign-in" className="px-4 py-2 text-purple-600 font-semibold text-sm hover:bg-purple-50 rounded-xl transition">
                Sign In
              </Link>
              <Link to="/sign-up" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm rounded-xl transition">
                Sign Up
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
        >
          {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          <form onSubmit={handleSearch} className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 mb-3">
            <FaSearch className="text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent focus:outline-none text-gray-700 text-sm flex-1"
            />
          </form>
          <Link to="/" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-medium">Home</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-medium">About</Link>
          {currentUser ? (
            <>
              <Link to="/dashboard/profile" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-medium">My Profile</Link>
              <Link to="/dashboard/explore" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-medium">Explore</Link>
              <button onClick={handleSignOut} className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium">Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/sign-in" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-medium">Sign In</Link>
              <Link to="/sign-up" onClick={() => setMenuOpen(false)} className="block px-3 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium text-center">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
