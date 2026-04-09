import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShieldAlt, FaUser, FaLock } from "react-icons/fa";

export default function AdminSignUp() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/server/admin/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
        return;
      }
      navigate("/admin/signin");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FaShieldAlt className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Admin Registration</h1>
          <p className="text-gray-500 text-sm mt-1">Create an administrator account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
            <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-xl px-3 py-3 focus-within:ring-2 focus-within:ring-purple-500">
              <FaUser className="text-gray-500" size={14} />
              <input
                type="text"
                id="username"
                placeholder="admin_username"
                onChange={handleChange}
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
                id="password"
                placeholder="Min 6 characters"
                onChange={handleChange}
                className="bg-transparent flex-1 text-white placeholder-gray-600 focus:outline-none"
                required
                minLength={6}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700/50 text-red-400 text-sm rounded-xl px-3 py-2">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Admin Account"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500 text-sm">
          Already have admin access?{" "}
          <Link to="/admin/signin" className="text-purple-400 hover:underline">Sign In</Link>
        </p>
        <p className="text-center mt-2 text-gray-600 text-xs">
          <Link to="/" className="hover:text-gray-400">← Back to main site</Link>
        </p>
      </div>
    </div>
  );
}
