import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBriefcase, FaSignOutAlt, FaTrash } from "react-icons/fa";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserSuccess,
} from "../redux/users/userSlice";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    password: "",
    avatar: currentUser?.avatar || "",
    address: currentUser?.address || "",
    mobileNumber: currentUser?.mobileNumber || "",
    profession: currentUser?.profession || "",
    age: currentUser?.age || "",
  });

  const [successMsg, setSuccessMsg] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(currentUser?.avatar || "");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
      setFormData((f) => ({ ...f, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const body = { ...formData };
      if (!body.password) delete body.password;

      const res = await fetch(`/server/user/update/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setSuccessMsg("Profile updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch("/server/auth/signout", { credentials: "include" });
      dispatch(signOutUserSuccess());
      navigate("/sign-in");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action is irreversible.")) return;
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/server/user/delete/${currentUser._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess());
      navigate("/sign-in");
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
    }
  };

  if (!currentUser) {
    navigate("/sign-in");
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar */}
        <div className="flex justify-center">
          <div className="relative">
            <img
              src={avatarPreview || currentUser.avatar}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-purple-200 shadow-lg"
              onError={(e) => { e.target.src = "https://t4.ftcdn.net/jpg/05/09/59/75/240_F_509597532_RKUuYsERhODmkxkZd82pSHnFtDAtgbzJ.jpg"; }}
            />
            <button
              type="button"
              onClick={() => fileRef.current.click()}
              className="absolute bottom-0 right-0 bg-purple-600 text-white rounded-full p-2 hover:bg-purple-700 transition shadow"
            >
              <FaCamera size={14} />
            </button>
            <input type="file" ref={fileRef} accept="image/*" onChange={handleFileChange} hidden />
          </div>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-purple-400">
              <FaUser className="text-gray-400" />
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={handleChange}
                className="flex-1 focus:outline-none text-gray-800"
                placeholder="Username"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-purple-400">
              <FaEnvelope className="text-gray-400" />
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="flex-1 focus:outline-none text-gray-800"
                placeholder="Email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
            <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-purple-400">
              <FaPhone className="text-gray-400" />
              <input
                type="tel"
                id="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                className="flex-1 focus:outline-none text-gray-800"
                placeholder="01XXXXXXXXX"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-purple-400">
              <FaUser className="text-gray-400" />
              <input
                type="number"
                id="age"
                value={formData.age}
                onChange={handleChange}
                className="flex-1 focus:outline-none text-gray-800"
                placeholder="Age"
                min="18"
                max="100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
            <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-purple-400">
              <FaBriefcase className="text-gray-400" />
              <input
                type="text"
                id="profession"
                value={formData.profession}
                onChange={handleChange}
                className="flex-1 focus:outline-none text-gray-800"
                placeholder="Profession"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-purple-400">
              <span className="text-gray-400">🔒</span>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="flex-1 focus:outline-none text-gray-800"
                placeholder="Leave blank to keep current"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <div className="flex items-start gap-2 border border-gray-300 rounded-xl px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-purple-400">
            <FaMapMarkerAlt className="text-gray-400 mt-1" />
            <textarea
              id="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
              className="flex-1 focus:outline-none text-gray-800 resize-none"
              placeholder="Your current address"
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {successMsg && <p className="text-green-600 text-sm text-center font-medium">{successMsg}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {/* Danger Zone */}
      <div className="mt-8 border border-red-200 rounded-xl p-4 bg-red-50">
        <h2 className="text-red-700 font-bold mb-3">Danger Zone</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-xl transition"
          >
            <FaSignOutAlt /> Sign Out
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition"
          >
            <FaTrash /> Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
