import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaHome, FaMapMarkerAlt, FaBed, FaBath, FaPhone, FaEnvelope,
  FaCouch, FaParking, FaStar, FaEye
} from "react-icons/fa";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function FeaturesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch("/server/properties/all?limit=20&sort=views&order=desc");
        const data = await res.json();
        setProperties(data.properties || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Featured Properties</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => <div key={i} className="bg-gray-200 rounded-2xl h-64 animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Error loading properties: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Featured Properties</h1>
          <p className="text-gray-500 text-sm mt-1">{properties.length} properties available</p>
        </div>
        <Link
          to="/dashboard/explore"
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
        >
          Explore All
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <FaHome size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-xl">No properties listed yet</p>
          <Link to="/dashboard/landlord" className="mt-4 inline-block bg-purple-600 text-white px-6 py-2 rounded-xl text-sm">
            List First Property
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {properties.map((property) => (
            <FeaturedPropertyCard key={property._id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}

function FeaturedPropertyCard({ property }) {
  const [showContact, setShowContact] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const handleEmailContact = () => {
    window.location.href = `mailto:${property.email}?subject=Inquiry about: ${property.title}&body=Hello, I am interested in your property listed on Basha Lagbe. Property: ${property.title}, Location: ${property.location}`;
  };

  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=90.4192,23.7104,90.4392,23.7304&layer=mapnik&zoom=14`;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=400&q=80"; }}
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${property.renterType === "family" ? "bg-blue-500" : property.renterType === "bachelor" ? "bg-green-500" : "bg-purple-500"} text-white`}>
            {property.renterType === "any" ? "All Renters" : property.renterType}
          </span>
          {property.furnished && <span className="bg-yellow-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">Furnished</span>}
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
          <FaEye size={10} /> {property.views || 0}
        </div>
        {!property.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white font-bold px-4 py-2 rounded-full">Not Available</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex-1 mr-3">
            <h2 className="font-bold text-gray-800 text-lg leading-tight line-clamp-2">{property.title}</h2>
            <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
              <FaMapMarkerAlt className="text-purple-400 flex-shrink-0" size={12} />
              <span className="line-clamp-1">{property.location}</span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-2xl font-bold text-purple-600">৳{property.price?.toLocaleString()}</div>
            <div className="text-gray-400 text-xs">per month</div>
          </div>
        </div>

        {/* Specs Row */}
        <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
          <span className="flex items-center gap-1"><FaBed className="text-blue-400" /> {property.bedrooms} Bedroom{property.bedrooms !== 1 ? "s" : ""}</span>
          <span className="flex items-center gap-1"><FaBath className="text-green-400" /> {property.bathrooms} Bathroom{property.bathrooms !== 1 ? "s" : ""}</span>
          {property.area > 0 && <span>{property.area} sqft</span>}
          {property.furnished && <span className="flex items-center gap-1"><FaCouch className="text-yellow-500" /> Furnished</span>}
          {property.parking && <span className="flex items-center gap-1"><FaParking className="text-blue-500" /> Parking</span>}
        </div>

        {/* Description */}
        <p className="text-gray-500 text-sm mt-3 line-clamp-2">{property.description}</p>

        {/* Amenities */}
        {property.amenities?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {property.amenities.slice(0, 4).map((a) => (
              <span key={a} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{a}</span>
            ))}
            {property.amenities.length > 4 && (
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">+{property.amenities.length - 4}</span>
            )}
          </div>
        )}

        {/* Available From */}
        <div className="mt-3 flex items-center gap-2 text-sm">
          <FaStar className="text-yellow-400" size={12} />
          <span className="text-gray-500">
            Available from {MONTHS[(property.availableMonth || 1) - 1]} {property.availableYear}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <Link
            to={`/property/${property._id}`}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-center py-2 rounded-xl text-sm font-medium transition"
          >
            View Details
          </Link>
          <button
            onClick={() => setShowContact(!showContact)}
            className="flex-1 border border-purple-600 text-purple-600 hover:bg-purple-50 py-2 rounded-xl text-sm font-medium transition"
          >
            Contact
          </button>
          <button
            onClick={() => setShowMap(!showMap)}
            className="flex items-center gap-1 border border-gray-300 text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-xl text-sm transition"
          >
            <FaMapMarkerAlt size={14} />
          </button>
        </div>

        {/* Contact Panel */}
        {showContact && (
          <div className="mt-4 bg-gray-50 rounded-xl p-4 space-y-2">
            <p className="text-sm font-medium text-gray-700">Landlord Contact Info</p>
            <div className="flex items-center gap-3">
              <FaPhone className="text-green-500" size={14} />
              <a href={`tel:${property.phoneNumber}`} className="text-gray-700 text-sm hover:text-purple-600">{property.phoneNumber}</a>
            </div>
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-blue-500" size={14} />
              <button onClick={handleEmailContact} className="text-blue-600 text-sm hover:underline text-left">{property.email}</button>
            </div>
          </div>
        )}

        {/* Map */}
        {showMap && (
          <div className="mt-4 rounded-xl overflow-hidden h-48">
            <iframe
              title={`Map for ${property.title}`}
              src={mapSrc}
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
            />
          </div>
        )}
      </div>
    </div>
  );
}
