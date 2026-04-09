import { useEffect, useState } from "react";
import { FaSearch, FaTrash, FaHome, FaExclamationTriangle, FaMapMarkerAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";

export default function PropertyControlPage() {
  const [properties, setProperties] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    if (!search) { setFiltered(properties); return; }
    const q = search.toLowerCase();
    setFiltered(properties.filter((p) =>
      p.title?.toLowerCase().includes(q) || p.location?.toLowerCase().includes(q)
    ));
  }, [search, properties]);

  const fetchProperties = async () => {
    try {
      const res = await fetch("/server/properties/all?limit=50");
      const data = await res.json();
      const list = data.properties || [];
      setProperties(list);
      setFiltered(list);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this property listing?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/server/properties/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleAvailability = async (property) => {
    try {
      const res = await fetch(`/server/properties/update/${property._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isAvailable: !property.isAvailable }),
      });
      if (res.ok) {
        setProperties((prev) =>
          prev.map((p) => p._id === property._id ? { ...p, isAvailable: !p.isAvailable } : p)
        );
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Property Management</h1>
          <p className="text-gray-400 text-sm mt-1">{properties.length} total listings</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 w-full sm:w-72">
          <FaSearch className="text-gray-500" size={14} />
          <input
            type="text"
            placeholder="Search by title or location..."
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
          {[1, 2, 3, 4].map((i) => <div key={i} className="bg-gray-800 h-20 rounded-xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <FaHome size={40} className="mx-auto mb-3 opacity-30" />
          <p>{search ? "No properties match your search" : "No properties found"}</p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900/50 text-gray-400 text-xs uppercase border-b border-gray-700">
                  <th className="text-left px-5 py-3 font-medium">Property</th>
                  <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Location</th>
                  <th className="text-left px-5 py-3 font-medium">Price</th>
                  <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Type</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((property) => (
                  <tr key={property._id} className="border-b border-gray-700/50 hover:bg-gray-700/20 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-700 flex-shrink-0"
                          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=200&q=80"; }}
                        />
                        <div>
                          <p className="text-white font-medium text-sm line-clamp-1">{property.title}</p>
                          <p className="text-gray-500 text-xs md:hidden flex items-center gap-1">
                            <FaMapMarkerAlt size={10} /> {property.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-sm hidden md:table-cell">
                      <div className="flex items-center gap-1">
                        <FaMapMarkerAlt size={10} className="text-purple-400" />
                        {property.location}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-purple-400 font-bold text-sm">৳{property.price?.toLocaleString()}</td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${property.renterType === "family" ? "bg-blue-900/50 text-blue-300" : property.renterType === "bachelor" ? "bg-green-900/50 text-green-300" : "bg-purple-900/50 text-purple-300"}`}>
                        {property.renterType}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggleAvailability(property)}
                        className={`flex items-center gap-1 text-xs font-medium ${property.isAvailable ? "text-green-400" : "text-gray-500"}`}
                      >
                        {property.isAvailable ? <FaToggleOn size={18} className="text-green-400" /> : <FaToggleOff size={18} className="text-gray-600" />}
                        <span className="hidden sm:inline">{property.isAvailable ? "Available" : "Rented"}</span>
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleDelete(property._id)}
                        disabled={deletingId === property._id}
                        className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-700/50 hover:border-red-600 px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ml-auto disabled:opacity-50"
                      >
                        <FaTrash size={10} />
                        {deletingId === property._id ? "..." : "Delete"}
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
