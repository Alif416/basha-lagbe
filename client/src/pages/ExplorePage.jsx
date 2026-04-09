import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaSearch, FaFilter, FaHome, FaMapMarkerAlt, FaBed, FaBath, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const DIVISIONS = ["Dhaka", "Chittagong", "Rajshahi", "Khulna", "Barisal", "Sylhet", "Rangpur", "Mymensingh"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function ExplorePage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    renterType: searchParams.get("renterType") || "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    bathrooms: "",
    division: "",
    furnished: false,
    parking: false,
    sort: "createdAt",
    order: "desc",
  });

  const [properties, setProperties] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const fetchProperties = useCallback(async (currentPage = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, val]) => {
        if (val !== "" && val !== false) params.set(key, val);
      });
      if (filters.furnished) params.set("furnished", "true");
      if (filters.parking) params.set("parking", "true");
      params.set("page", currentPage);
      params.set("limit", "12");

      const res = await fetch(`/server/properties/all?${params.toString()}`);
      const data = await res.json();
      setProperties(data.properties || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProperties(page);
  }, [page, fetchProperties]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProperties(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "", renterType: "", minPrice: "", maxPrice: "",
      bedrooms: "", bathrooms: "", division: "",
      furnished: false, parking: false,
      sort: "createdAt", order: "desc",
    });
    setPage(1);
  };

  const hasActiveFilters = filters.renterType || filters.minPrice || filters.maxPrice ||
    filters.bedrooms || filters.bathrooms || filters.division ||
    filters.furnished || filters.parking;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-purple-700 to-blue-700 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-4">Explore Properties</h1>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow">
              <FaSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, location, area..."
                className="flex-1 focus:outline-none text-gray-800"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
              {filters.search && (
                <button type="button" onClick={() => handleFilterChange("search", "")}>
                  <FaTimes className="text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition ${showFilters || hasActiveFilters ? "bg-yellow-400 text-gray-900" : "bg-white/20 text-white hover:bg-white/30"}`}
            >
              <FaFilter size={14} />
              Filters
              {hasActiveFilters && <span className="bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">!</span>}
            </button>
            <button
              type="submit"
              className="bg-white text-purple-700 font-bold px-6 py-3 rounded-xl hover:bg-purple-50 transition"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b shadow-sm px-4 py-5">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Renter Type</label>
                <select
                  value={filters.renterType}
                  onChange={(e) => handleFilterChange("renterType", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                >
                  <option value="">All</option>
                  <option value="bachelor">Bachelor</option>
                  <option value="family">Family</option>
                  <option value="any">Any</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Division</label>
                <select
                  value={filters.division}
                  onChange={(e) => handleFilterChange("division", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                >
                  <option value="">All</option>
                  {DIVISIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Min Price (৳)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Max Price (৳)</label>
                <input
                  type="number"
                  placeholder="Any"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Min Bedrooms</label>
                <select
                  value={filters.bedrooms}
                  onChange={(e) => handleFilterChange("bedrooms", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                >
                  <option value="">Any</option>
                  {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Sort By</label>
                <select
                  value={`${filters.sort}_${filters.order}`}
                  onChange={(e) => {
                    const [sort, order] = e.target.value.split("_");
                    setFilters((f) => ({ ...f, sort, order }));
                  }}
                  className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                >
                  <option value="createdAt_desc">Newest First</option>
                  <option value="createdAt_asc">Oldest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-6 mt-4">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.furnished}
                  onChange={(e) => handleFilterChange("furnished", e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                Furnished
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.parking}
                  onChange={(e) => handleFilterChange("parking", e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                Parking Available
              </label>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-red-500 text-sm hover:underline flex items-center gap-1">
                  <FaTimes size={12} /> Clear filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-600 text-sm">
            {loading ? "Searching..." : `${total} properties found`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : properties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-40"
                >
                  <FaChevronLeft />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => Math.abs(p - page) <= 2)
                  .map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-lg font-medium transition ${p === page ? "bg-purple-600 text-white" : "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"}`}
                    >
                      {p}
                    </button>
                  ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-40"
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <FaHome size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-xl font-medium">No properties found</p>
            <p className="text-sm mt-2">Try adjusting your search filters</p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl text-sm">
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function PropertyCard({ property }) {
  return (
    <Link to={`/property/${property._id}`}>
      <div className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border border-gray-100">
        <div className="relative h-44 overflow-hidden">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=400&q=80"; }}
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${property.renterType === "family" ? "bg-blue-500" : property.renterType === "bachelor" ? "bg-green-500" : "bg-purple-500"} text-white`}>
              {property.renterType === "any" ? "All" : property.renterType}
            </span>
            {property.furnished && (
              <span className="bg-yellow-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">Furnished</span>
            )}
          </div>
          {!property.isAvailable && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-500 text-white font-bold px-3 py-1 rounded-full text-sm">Rented</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-bold text-gray-800 line-clamp-1">{property.title}</h3>
          <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
            <FaMapMarkerAlt className="text-purple-400" />
            <span className="line-clamp-1">{property.location}</span>
          </div>
          <div className="flex gap-4 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1"><FaBed className="text-blue-400" /> {property.bedrooms} Bed</span>
            <span className="flex items-center gap-1"><FaBath className="text-green-400" /> {property.bathrooms} Bath</span>
            {property.area > 0 && <span>{property.area} sqft</span>}
          </div>
          <div className="flex justify-between items-center mt-3">
            <div>
              <span className="text-xl font-bold text-purple-600">৳{property.price?.toLocaleString()}</span>
              <span className="text-gray-400 text-xs">/mo</span>
            </div>
            <span className="text-xs text-gray-400">
              {MONTHS[(property.availableMonth || 1) - 1]} {property.availableYear}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
