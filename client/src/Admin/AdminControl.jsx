import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaHome, FaChartBar, FaEye } from "react-icons/fa";

export default function AdminControl() {
  const [stats, setStats] = useState({ totalUsers: 0, totalProperties: 0, availableProperties: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const [usersRes, propsRes] = await Promise.all([
          fetch("/server/user/total/users", {
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include",
          }),
          fetch("/server/properties/total/properties"),
        ]);
        const usersData = await usersRes.json();
        const propsData = await propsRes.json();
        setStats({
          totalUsers: usersData.totalUsers || 0,
          totalProperties: propsData.totalProperties || 0,
          availableProperties: propsData.availableProperties || 0,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: "Total Users", value: stats.totalUsers, icon: <FaUsers size={32} />, color: "from-blue-500 to-blue-700", link: "/admin/dashboard/users" },
    { title: "Total Properties", value: stats.totalProperties, icon: <FaHome size={32} />, color: "from-green-500 to-green-700", link: "/admin/dashboard/properties" },
    { title: "Available Properties", value: stats.availableProperties, icon: <FaEye size={32} />, color: "from-purple-500 to-purple-700", link: "/admin/dashboard/properties" },
    { title: "Analytics", value: "View", icon: <FaChartBar size={32} />, color: "from-orange-500 to-orange-700", link: "/admin/dashboard/analytics" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-white">Dashboard Overview</h1>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-700 rounded-2xl h-36 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <Link to={card.link} key={i}>
              <div className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 text-white shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium opacity-80">{card.title}</p>
                    <p className="text-4xl font-bold mt-2">{card.value}</p>
                  </div>
                  <div className="opacity-80">{card.icon}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 bg-gray-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/admin/dashboard/users" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">Manage Users</Link>
          <Link to="/admin/dashboard/properties" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition">Manage Properties</Link>
          <Link to="/admin/dashboard/analytics" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition">View Analytics</Link>
        </div>
      </div>
    </div>
  );
}
