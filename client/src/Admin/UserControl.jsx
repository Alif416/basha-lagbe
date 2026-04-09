import { useEffect, useState } from "react";
import { FaSearch, FaTrash, FaUser, FaExclamationTriangle } from "react-icons/fa";

export default function UserControlPage() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!search) { setFiltered(users); return; }
    const q = search.toLowerCase();
    setFiltered(users.filter((u) => u.username?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)));
  }, [search, users]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/server/user/allusers", { credentials: "include" });
      const data = await res.json();
      if (Array.isArray(data)) {
        setUsers(data);
        setFiltered(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;
    setDeletingId(userId);
    try {
      const res = await fetch(`/server/user/delete/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-gray-400 text-sm mt-1">{users.length} total users</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 w-full sm:w-72">
          <FaSearch className="text-gray-500" size={14} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-white placeholder-gray-500 text-sm focus:outline-none flex-1"
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-900/30 border border-red-700 text-red-400 rounded-xl p-3 mb-4">
          <FaExclamationTriangle size={14} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => <div key={i} className="bg-gray-800 h-16 rounded-xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <FaUser size={40} className="mx-auto mb-3 opacity-30" />
          <p>{search ? "No users match your search" : "No users found"}</p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900/50 text-gray-400 text-xs uppercase border-b border-gray-700">
                  <th className="text-left px-5 py-3 font-medium">User</th>
                  <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Email</th>
                  <th className="text-left px-5 py-3 font-medium hidden lg:table-cell">Joined</th>
                  <th className="text-left px-5 py-3 font-medium hidden lg:table-cell">Profession</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user._id} className="border-b border-gray-700/50 hover:bg-gray-700/20 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="w-9 h-9 rounded-full object-cover bg-gray-700"
                          onError={(e) => { e.target.src = "https://t4.ftcdn.net/jpg/05/09/59/75/240_F_509597532_RKUuYsERhODmkxkZd82pSHnFtDAtgbzJ.jpg"; }}
                        />
                        <div>
                          <p className="text-white font-medium text-sm">{user.username}</p>
                          <p className="text-gray-500 text-xs md:hidden">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-sm hidden md:table-cell">{user.email}</td>
                    <td className="px-5 py-4 text-gray-500 text-sm hidden lg:table-cell">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-sm hidden lg:table-cell">{user.profession || "—"}</td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleDelete(user._id)}
                        disabled={deletingId === user._id}
                        className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-700/50 hover:border-red-600 px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ml-auto disabled:opacity-50"
                      >
                        <FaTrash size={10} />
                        {deletingId === user._id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
