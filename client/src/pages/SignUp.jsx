import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { FaUser, FaEnvelope, FaLock, FaCheckCircle } from "react-icons/fa";

export default function SignUp() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/server/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        return;
      }
      navigate("/sign-in");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = (pwd) => {
    if (!pwd) return null;
    if (pwd.length < 6) return { level: "weak", color: "bg-red-400", label: "Too short" };
    if (pwd.length < 8) return { level: "fair", color: "bg-yellow-400", label: "Fair" };
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return { level: "strong", color: "bg-green-500", label: "Strong" };
    return { level: "medium", color: "bg-blue-400", label: "Medium" };
  };

  const strength = passwordStrength(formData.password);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 py-8"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(30,64,175,0.9) 0%, rgba(88,28,135,0.9) 100%), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80')`,
      }}
    >
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">Create account</h1>
          <p className="text-gray-500 mt-2">Join thousands finding their perfect home</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-3 focus-within:ring-2 focus-within:ring-purple-400 focus-within:border-transparent">
              <FaUser className="text-gray-400" size={14} />
              <input
                type="text"
                id="username"
                placeholder="johndoe"
                onChange={handleChange}
                className="flex-1 focus:outline-none text-gray-800"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-3 focus-within:ring-2 focus-within:ring-purple-400 focus-within:border-transparent">
              <FaEnvelope className="text-gray-400" size={14} />
              <input
                type="email"
                id="email"
                placeholder="your@email.com"
                onChange={handleChange}
                className="flex-1 focus:outline-none text-gray-800"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-3 focus-within:ring-2 focus-within:ring-purple-400 focus-within:border-transparent">
              <FaLock className="text-gray-400" size={14} />
              <input
                type="password"
                id="password"
                placeholder="Min 6 characters"
                onChange={handleChange}
                className="flex-1 focus:outline-none text-gray-800"
                required
              />
            </div>
            {strength && (
              <div className="mt-1.5 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full ${strength.color} transition-all ${strength.level === "weak" ? "w-1/4" : strength.level === "fair" ? "w-2/4" : strength.level === "medium" ? "w-3/4" : "w-full"}`} />
                </div>
                <span className="text-xs text-gray-500">{strength.label}</span>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-3 py-2">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <OAuth />
        </form>

        {/* Benefits */}
        <div className="mt-6 space-y-2">
          {["Free to join", "Verified property listings", "Direct landlord contact"].map((b) => (
            <div key={b} className="flex items-center gap-2 text-gray-500 text-xs">
              <FaCheckCircle className="text-green-500 flex-shrink-0" size={12} />
              <span>{b}</span>
            </div>
          ))}
        </div>

        <p className="text-center mt-4 text-gray-600 text-sm">
          Already have an account?{" "}
          <Link to="/sign-in" className="text-purple-600 font-semibold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
