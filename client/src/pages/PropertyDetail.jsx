import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaCouch, FaParking,
  FaPhone, FaEnvelope, FaArrowLeft, FaShare, FaStar, FaCalendarAlt, FaEye
} from "react-icons/fa";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPhone, setShowPhone] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`/server/properties/get/${id}`);
        if (!res.ok) throw new Error("Property not found");
        const data = await res.json();
        setProperty(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Property not found"}</p>
          <button onClick={() => navigate(-1)} className="bg-purple-600 text-white px-6 py-2 rounded-xl">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=90.3192,23.6604,90.5192,23.8604&layer=mapnik&zoom=12`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-72 md:h-96 bg-gray-900 overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover opacity-80"
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=1200&q=80"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white border border-white/30 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-white/30 transition"
        >
          <FaArrowLeft size={14} /> Back
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white border border-white/30 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-white/30 transition"
        >
          <FaShare size={14} /> {copied ? "Copied!" : "Share"}
        </button>

        {/* Title Overlay */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex gap-2 mb-2">
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${property.renterType === "family" ? "bg-blue-500" : property.renterType === "bachelor" ? "bg-green-500" : "bg-purple-500"} text-white`}>
              {property.renterType === "any" ? "All Renters" : property.renterType.charAt(0).toUpperCase() + property.renterType.slice(1)}
            </span>
            {property.furnished && <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">Furnished</span>}
            {!property.isAvailable && <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">Not Available</span>}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">{property.title}</h1>
          <div className="flex items-center gap-1 text-white/80 mt-1">
            <FaMapMarkerAlt size={14} />
            <span>{property.location}{property.district ? `, ${property.district}` : ""}{property.division ? `, ${property.division}` : ""}</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price & Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-4xl font-extrabold text-purple-600">৳{property.price?.toLocaleString()}</span>
                  <span className="text-gray-400 ml-1">/ month</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <FaEye size={14} /> {property.views || 0} views
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 text-green-600">
                <FaCalendarAlt size={14} />
                <span className="text-sm font-medium">
                  Available from {MONTHS[(property.availableMonth || 1) - 1]} {property.availableYear}
                </span>
              </div>
            </div>

            {/* Key Features */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Property Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { icon: <FaBed className="text-blue-400" />, label: "Bedrooms", value: property.bedrooms },
                  { icon: <FaBath className="text-green-400" />, label: "Bathrooms", value: property.bathrooms },
                  property.area > 0 && { icon: <FaRulerCombined className="text-orange-400" />, label: "Area", value: `${property.area} sqft` },
                  property.floor > 0 && { icon: <span className="text-purple-400 font-bold text-sm">FL</span>, label: "Floor", value: property.floor },
                  { icon: <FaCouch className="text-yellow-500" />, label: "Furnished", value: property.furnished ? "Yes" : "No" },
                  { icon: <FaParking className="text-blue-500" />, label: "Parking", value: property.parking ? "Yes" : "No" },
                ].filter(Boolean).map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="text-xl">{item.icon}</div>
                    <div>
                      <div className="text-xs text-gray-500">{item.label}</div>
                      <div className="font-semibold text-gray-800">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-3">Description</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{property.description}</p>
            </div>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {property.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2 text-gray-700">
                      <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0" />
                      <span className="text-sm">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="p-4 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">Location</h2>
                <button
                  onClick={() => setShowMap(!showMap)}
                  className="text-purple-600 text-sm font-medium hover:underline"
                >
                  {showMap ? "Hide Map" : "Show Map"}
                </button>
              </div>
              {showMap && (
                <div className="h-64">
                  <iframe
                    title="Property Location"
                    src={mapSrc}
                    className="w-full h-full border-0"
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
              )}
              <div className="px-4 pb-4 text-gray-500 text-sm flex items-start gap-2">
                <FaMapMarkerAlt className="text-purple-400 mt-0.5 flex-shrink-0" />
                <span>{property.location}{property.district ? `, ${property.district}` : ""}{property.division ? `, ${property.division}` : ""}</span>
              </div>
            </div>
          </div>

          {/* Sidebar: Contact */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Contact Landlord</h2>

              <div className="space-y-3">
                <button
                  onClick={() => setShowPhone(!showPhone)}
                  className="w-full flex items-center gap-3 bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 font-medium py-3 px-4 rounded-xl transition"
                >
                  <FaPhone />
                  {showPhone ? property.phoneNumber : "Show Phone Number"}
                </button>

                <a
                  href={`mailto:${property.email}?subject=Inquiry about: ${property.title}`}
                  className="w-full flex items-center gap-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-medium py-3 px-4 rounded-xl transition"
                >
                  <FaEnvelope />
                  Send Email
                </a>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center">
                  Contact the landlord directly. Always visit the property in person before paying any advance.
                </p>
              </div>

              <div className="mt-4 flex gap-3 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <FaStar className="text-yellow-400" size={12} />
                  <span>Verified listing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
