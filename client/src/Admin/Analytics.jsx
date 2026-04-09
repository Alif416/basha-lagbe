import { useEffect, useState } from "react";
import { FaUsers, FaHome, FaEye, FaChartLine } from "react-icons/fa";

export default function AnalyticsPage() {
  const [stats, setStats] = useState({ totalUsers: 0, totalProperties: 0, availableProperties: 0 });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentProperties, setRecentProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [usersRes, propsRes, recentPropsRes] = await Promise.all([
          fetch("/server/user/total/users", { credentials: "include" }),
          fetch("/server/properties/total/properties"),
          fetch("/server/properties/all?limit=5&sort=createdAt&order=desc"),
        ]);

        const usersData = await usersRes.json();
        const propsData = await propsRes.json();
        const recentPropsData = await recentPropsRes.json();

        setStats({
          totalUsers: usersData.totalUsers || 0,
          totalProperties: propsData.totalProperties || 0,
          availableProperties: propsData.availableProperties || 0,
        });
        setRecentProperties(recentPropsData.properties || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const metricCards = [
    { title: "Total Users", value: stats.totalUsers, icon: <FaUsers />, color: "from-blue-500 to-blue-600", change: "+12%" },
    { title: "Total Properties", value: stats.totalProperties, icon: <FaHome />, color: "from-green-500 to-green-600", change: "+8%" },
    { title: "Available Now", value: stats.availableProperties, icon: <FaEye />, color: "from-purple-500 to-purple-600", change: "+5%" },
    { title: "Total Views", value: recentProperties.reduce((sum, p) => sum + (p.views || 0), 0), icon: <FaChartLine />, color: "from-orange-500 to-orange-600", change: "+24%" },
  ];

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white mb-6">Analytics</h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="bg-gray-800 h-28 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Analytics Dashboard</h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metricCards.map((card, i) => (
          <div key={i} className={`bg-gradient-to-br ${card.color} rounded-2xl p-5 text-white shadow-lg`}>
            <div className="flex justify-between items-start mb-3">
              <span className="text-white/70 text-2xl">{card.icon}</span>
              <span className="text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">{card.change}</span>
            </div>
            <div className="text-3xl font-extrabold">{card.value.toLocaleString()}</div>
            <div className="text-white/70 text-sm mt-1">{card.title}</div>
          </div>
        ))}
      </div>

      {/* Recent Properties Table */}
      <div className="bg-gray-800 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Recently Listed Properties</h2>
        {recentProperties.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-gray-400 text-sm border-b border-gray-700">
                  <th className="text-left pb-3 font-medium">Title</th>
                  <th className="text-left pb-3 font-medium hidden md:table-cell">Location</th>
                  <th className="text-left pb-3 font-medium">Price</th>
                  <th className="text-left pb-3 font-medium">Type</th>
                  <th className="text-left pb-3 font-medium hidden md:table-cell">Views</th>
                </tr>
              </thead>
              <tbody>
                {recentProperties.map((p) => (
                  <tr key={p._id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition">
                    <td className="py-3 text-white text-sm font-medium">{p.title}</td>
                    <td className="py-3 text-gray-400 text-sm hidden md:table-cell">{p.location}</td>
                    <td className="py-3 text-purple-400 text-sm font-bold">৳{p.price?.toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.renterType === "family" ? "bg-blue-900/50 text-blue-300" : p.renterType === "bachelor" ? "bg-green-900/50 text-green-300" : "bg-purple-900/50 text-purple-300"}`}>
                        {p.renterType}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400 text-sm hidden md:table-cell">{p.views || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">No properties found.</p>
        )}
      </div>

      {/* Simple Bar Chart (CSS-based) */}
      <div className="bg-gray-800 rounded-2xl p-6 mt-4">
        <h2 className="text-lg font-bold text-white mb-4">Property Distribution by Type</h2>
        <div className="space-y-3">
          {[
            { label: "Family", value: recentProperties.filter(p => p.renterType === "family").length, color: "bg-blue-500" },
            { label: "Bachelor", value: recentProperties.filter(p => p.renterType === "bachelor").length, color: "bg-green-500" },
            { label: "Any", value: recentProperties.filter(p => p.renterType === "any").length, color: "bg-purple-500" },
          ].map((item) => {
            const total = recentProperties.length || 1;
            const pct = Math.round((item.value / total) * 100);
            return (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-gray-400 text-sm w-16">{item.label}</span>
                <div className="flex-1 bg-gray-700 rounded-full h-3">
                  <div className={`${item.color} h-3 rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                </div>
                <span className="text-gray-400 text-sm w-12 text-right">{item.value} ({pct}%)</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
