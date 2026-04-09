import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaHome, FaMapMarkerAlt, FaUsers, FaStar, FaArrowRight, FaBed, FaBath } from "react-icons/fa";

const DIVISIONS = ["Dhaka", "Chittagong", "Rajshahi", "Khulna", "Barisal", "Sylhet", "Rangpur", "Mymensingh"];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [renterType, setRenterType] = useState("");
  const [recentProperties, setRecentProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await fetch("/server/properties/recent");
        const data = await res.json();
        setRecentProperties(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (renterType) params.set("renterType", renterType);
    navigate(`/dashboard/explore?${params.toString()}`);
  };

  const stats = [
    { icon: <FaHome size={28} />, value: "500+", label: "Properties Listed" },
    { icon: <FaUsers size={28} />, value: "2000+", label: "Happy Tenants" },
    { icon: <FaMapMarkerAlt size={28} />, value: "8", label: "Divisions Covered" },
    { icon: <FaStar size={28} />, value: "4.8", label: "Average Rating" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(15,23,42,0.7) 0%, rgba(15,23,42,0.9) 100%), url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2070&q=80')`,
        }}
      >
        <div className="text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-purple-900/50 border border-purple-500/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Bangladesh&apos;s #1 To-Let Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Find Your Perfect{" "}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Basha
            </span>{" "}
            Today
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Browse thousands of verified rental properties across Bangladesh. Connect with landlords directly — no middlemen, no hassle.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col md:flex-row gap-3 max-w-3xl mx-auto shadow-2xl">
            <div className="flex-1 flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2">
              <FaSearch className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search by location, area or property name..."
                className="bg-transparent w-full text-white placeholder-gray-400 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={renterType}
              onChange={(e) => setRenterType(e.target.value)}
              className="bg-white/10 text-white rounded-xl px-4 py-2 focus:outline-none border border-white/20"
            >
              <option value="" className="bg-gray-800">All Types</option>
              <option value="bachelor" className="bg-gray-800">Bachelor</option>
              <option value="family" className="bg-gray-800">Family</option>
            </select>
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-8 py-3 rounded-xl transition-all duration-200 flex items-center gap-2"
            >
              <FaSearch /> Search
            </button>
          </form>

          {/* Quick Division Links */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {DIVISIONS.map((div) => (
              <button
                key={div}
                onClick={() => navigate(`/dashboard/explore?search=${div}`)}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-gray-300 text-sm px-3 py-1 rounded-full transition"
              >
                {div}
              </button>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1">
            <div className="w-1.5 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-6 bg-gray-800 rounded-2xl hover:bg-gray-750 transition">
                <div className="text-purple-400 flex justify-center mb-3">{stat.icon}</div>
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Properties */}
      <section className="py-16 bg-gray-950">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-white">Recently Listed</h2>
              <p className="text-gray-400 mt-1">Fresh properties added by verified landlords</p>
            </div>
            <Link
              to="/dashboard/explore"
              className="flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium"
            >
              View all <FaArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-800 rounded-2xl h-72 animate-pulse" />
              ))}
            </div>
          ) : recentProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentProperties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <FaHome size={48} className="mx-auto mb-4 opacity-30" />
              <p>No properties listed yet. Be the first to list!</p>
              <Link to="/sign-in" className="mt-4 inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl">
                List Your Property
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">How Basha Lagbe Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Create Account", desc: "Sign up for free and set up your profile in minutes." },
              { step: "02", title: "Browse Properties", desc: "Filter by location, price, type, and amenities to find the perfect match." },
              { step: "03", title: "Connect & Move In", desc: "Contact the landlord directly and arrange your visit." },
            ].map((item) => (
              <div key={item.step} className="relative p-6 bg-gray-800 rounded-2xl">
                <div className="text-6xl font-extrabold text-purple-900/50 absolute top-4 right-4">{item.step}</div>
                <div className="text-xl font-bold text-white mb-2">{item.title}</div>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-900 to-blue-900">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-4">Are You a Landlord?</h2>
          <p className="text-purple-200 text-lg mb-8">
            List your property on Basha Lagbe and reach thousands of verified tenants for free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/sign-up"
              className="bg-white text-purple-900 font-bold px-8 py-3 rounded-xl hover:bg-purple-50 transition"
            >
              List Your Property
            </Link>
            <Link
              to="/dashboard/explore"
              className="border border-white/40 text-white font-bold px-8 py-3 rounded-xl hover:bg-white/10 transition"
            >
              Browse Properties
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function PropertyCard({ property }) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return (
    <Link to={`/property/${property._id}`}>
      <div className="bg-gray-800 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-purple-900/20 transition-all duration-300 hover:-translate-y-1 group">
        <div className="relative h-48 overflow-hidden">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=400&q=80"; }}
          />
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${property.renterType === "family" ? "bg-blue-500" : property.renterType === "bachelor" ? "bg-green-500" : "bg-purple-500"} text-white`}>
              {property.renterType === "any" ? "All Renters" : property.renterType.charAt(0).toUpperCase() + property.renterType.slice(1)}
            </span>
          </div>
          {!property.isAvailable && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="bg-red-500 text-white font-bold px-4 py-2 rounded-full">Not Available</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-bold text-white text-lg line-clamp-1">{property.title}</h3>
          <div className="flex items-center gap-1 text-gray-400 text-sm mt-1">
            <FaMapMarkerAlt className="text-purple-400" size={12} />
            <span className="line-clamp-1">{property.location}</span>
          </div>
          <div className="flex items-center gap-4 mt-3 text-gray-400 text-sm">
            {property.bedrooms > 0 && (
              <span className="flex items-center gap-1"><FaBed className="text-blue-400" /> {property.bedrooms} Bed</span>
            )}
            {property.bathrooms > 0 && (
              <span className="flex items-center gap-1"><FaBath className="text-green-400" /> {property.bathrooms} Bath</span>
            )}
          </div>
          <div className="flex justify-between items-center mt-4">
            <div>
              <span className="text-2xl font-bold text-purple-400">৳{property.price?.toLocaleString()}</span>
              <span className="text-gray-500 text-sm">/month</span>
            </div>
            <div className="text-xs text-gray-500">
              From {months[(property.availableMonth || 1) - 1]} {property.availableYear}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
