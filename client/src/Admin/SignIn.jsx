import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { adminSignInRequest, adminSignInSuccess, adminSignInFailure } from "../redux/admins/adminSlice";
import { FaShieldAlt, FaUser, FaLock } from "react-icons/fa";

const AdminSignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    dispatch(adminSignInRequest());
    try {
      const res = await fetch("/server/admin/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(adminSignInFailure(data.message));
        setError(data.message || "Sign in failed");
        return;
      }
      if (data.token) localStorage.setItem("adminToken", data.token);
      dispatch(adminSignInSuccess(data));
      navigate("/admin/dashboard");
    } catch (err) {
      const msg = err.message || "Network error";
      dispatch(adminSignInFailure(msg));
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FaShieldAlt className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Admin Sign In</h1>
          <p className="text-gray-500 text-sm mt-1">Access the Basha Lagbe admin panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
            <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-xl px-3 py-3 focus-within:ring-2 focus-within:ring-purple-500">
              <FaUser className="text-gray-500" size={14} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="bg-transparent flex-1 text-white placeholder-gray-600 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-xl px-3 py-3 focus-within:ring-2 focus-within:ring-purple-500">
              <FaLock className="text-gray-500" size={14} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent flex-1 text-white placeholder-gray-600 focus:outline-none"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700/50 text-red-400 text-sm rounded-xl px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 rounded-xl transition"
          >
            Sign In to Admin Panel
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500 text-sm">
          Don&apos;t have admin access?{" "}
          <Link to="/admin/signup" className="text-purple-400 hover:underline">Register</Link>
        </p>
        <p className="text-center mt-2 text-gray-600 text-xs">
          <Link to="/" className="hover:text-gray-400">← Back to main site</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminSignIn;
