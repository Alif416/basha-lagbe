import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signInFailure, signInStart, signInSuccess } from "../redux/users/userSlice";
import OAuth from "../components/OAuth";
import { FaEnvelope, FaLock } from "react-icons/fa";

export default function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/server/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/dashboard/explore");
    } catch (err) {
      dispatch(signInFailure(err.message));
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(88,28,135,0.9) 0%, rgba(30,64,175,0.9) 100%), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80')`,
      }}
    >
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">Welcome back</h1>
          <p className="text-gray-500 mt-2">Sign in to your Basha Lagbe account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="••••••••"
                onChange={handleChange}
                className="flex-1 focus:outline-none text-gray-800"
                required
              />
            </div>
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
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <OAuth />
        </form>

        <p className="text-center mt-6 text-gray-600 text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/sign-up" className="text-purple-600 font-semibold hover:underline">Sign Up</Link>
        </p>

        <p className="text-center mt-2 text-gray-400 text-xs">
          Admin?{" "}
          <Link to="/admin/signin" className="text-gray-500 hover:underline">Admin Sign In</Link>
        </p>
      </div>
    </div>
  );
}
