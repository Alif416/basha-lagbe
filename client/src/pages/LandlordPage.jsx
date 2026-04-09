import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FaHome, FaMapMarkerAlt, FaPhone, FaEnvelope, FaImage,
  FaBed, FaBath, FaRulerCombined, FaParking, FaCouch, FaCheckCircle
} from "react-icons/fa";

const DIVISIONS = ["Dhaka", "Chittagong", "Rajshahi", "Khulna", "Barisal", "Sylhet", "Rangpur", "Mymensingh"];
const AMENITIES = ["Gas", "Electricity", "Water Supply", "Elevator", "Security Guard", "Generator", "CCTV", "Rooftop Access", "Balcony", "Air Conditioning"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const initialForm = {
  title: "", description: "", price: "", location: "", district: "", division: "",
  image: "", renterType: "family", availableMonth: "", availableYear: new Date().getFullYear(),
  phoneNumber: "", email: "", bedrooms: 1, bathrooms: 1, area: "", floor: "",
  furnished: false, parking: false, amenities: [],
};

export default function LandlordPage() {
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <FaHome size={48} className="text-gray-300" />
        <p className="text-gray-600 text-lg">Please sign in to list a property</p>
        <Link to="/sign-in" className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700">
          Sign In
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const toggleAmenity = (amenity) => {
    setFormData((f) => ({
      ...f,
      amenities: f.amenities.includes(amenity)
        ? f.amenities.filter((a) => a !== amenity)
        : [...f.amenities, amenity],
    }));
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.title || !formData.description) return "Title and description are required.";
      if (!formData.location || !formData.division) return "Location and division are required.";
    }
    if (step === 2) {
      if (!formData.price || Number(formData.price) <= 0) return "Valid price is required.";
      if (!formData.renterType) return "Renter type is required.";
      if (!formData.availableMonth || !formData.availableYear) return "Availability date is required.";
    }
    if (step === 3) {
      if (!formData.phoneNumber || !/^\d{11}$/.test(formData.phoneNumber)) return "Valid 11-digit phone number is required.";
      if (!formData.email) return "Email is required.";
      if (!formData.image) return "Property image URL is required.";
    }
    return null;
  };

  const nextStep = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");
    setStep((s) => s + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");

    try {
      setLoading(true);
      const payload = {
        ...formData,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        area: Number(formData.area) || 0,
        floor: Number(formData.floor) || 0,
        availableMonth: Number(formData.availableMonth),
        availableYear: Number(formData.availableYear),
        userRef: currentUser._id,
        email: formData.email || currentUser.email,
      };

      const res = await fetch("/server/properties/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add property");

      setSuccess(true);
      setFormData(initialForm);
      setStep(1);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = ["Property Details", "Pricing & Availability", "Contact & Images"];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">List Your Property</h1>
      <p className="text-gray-500 mb-8">Fill in the details to publish your rental listing on Basha Lagbe.</p>

      {success && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-2xl p-4 mb-6">
          <FaCheckCircle size={20} />
          <div>
            <p className="font-bold">Property listed successfully!</p>
            <p className="text-sm">Your listing is now live and visible to potential tenants.</p>
          </div>
        </div>
      )}

      {/* Step Indicator */}
      <div className="flex items-center mb-8">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${i + 1 <= step ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-500"}`}>
              {i + 1 < step ? "✓" : i + 1}
            </div>
            <div className="ml-2 hidden sm:block">
              <p className={`text-xs font-medium ${i + 1 <= step ? "text-purple-600" : "text-gray-400"}`}>{s}</p>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${i + 1 < step ? "bg-purple-600" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">

        {/* Step 1: Property Details */}
        {step === 1 && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Title *</label>
              <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-purple-400">
                <FaHome className="text-gray-400" />
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Spacious 3-bedroom flat in Dhanmondi"
                  className="flex-1 focus:outline-none text-gray-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your property — nearby facilities, special features, conditions..."
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-purple-400 focus:outline-none text-gray-800 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location / Area *</label>
                <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-purple-400">
                  <FaMapMarkerAlt className="text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Dhanmondi, Dhaka"
                    className="flex-1 focus:outline-none text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Division *</label>
                <select
                  name="division"
                  value={formData.division}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-purple-400 focus:outline-none text-gray-800"
                >
                  <option value="">Select Division</option>
                  {DIVISIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="e.g., Dhaka"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-purple-400 focus:outline-none text-gray-800"
                />
              </div>
            </div>

            {/* Property specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-2.5">
                  <FaBed className="text-gray-400" />
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    min="1"
                    max="20"
                    className="flex-1 focus:outline-none text-gray-800 w-12"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-2.5">
                  <FaBath className="text-gray-400" />
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    className="flex-1 focus:outline-none text-gray-800 w-12"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area (sqft)</label>
                <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-2.5">
                  <FaRulerCombined className="text-gray-400" />
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="0"
                    className="flex-1 focus:outline-none text-gray-800 w-12"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Floor No.</label>
                <input
                  type="number"
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-purple-400 focus:outline-none text-gray-800"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="furnished" checked={formData.furnished} onChange={handleChange} className="w-4 h-4 text-purple-600 rounded" />
                <FaCouch className="text-yellow-500" />
                <span className="text-gray-700 text-sm font-medium">Furnished</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="parking" checked={formData.parking} onChange={handleChange} className="w-4 h-4 text-purple-600 rounded" />
                <FaParking className="text-blue-500" />
                <span className="text-gray-700 text-sm font-medium">Parking Available</span>
              </label>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
              <div className="flex flex-wrap gap-2">
                {AMENITIES.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggleAmenity(a)}
                    className={`px-3 py-1 rounded-full text-sm border transition ${formData.amenities.includes(a) ? "bg-purple-600 border-purple-600 text-white" : "bg-white border-gray-300 text-gray-600 hover:border-purple-400"}`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Step 2: Pricing & Availability */}
        {step === 2 && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent (৳) *</label>
              <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-purple-400">
                <span className="text-gray-500 font-bold mr-2">৳</span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g., 15000"
                  className="flex-1 focus:outline-none text-gray-800"
                  min="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Renter Type *</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "family", label: "Family", icon: "👨‍👩‍👧‍👦" },
                  { value: "bachelor", label: "Bachelor", icon: "🎓" },
                  { value: "any", label: "Any", icon: "🤝" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormData((f) => ({ ...f, renterType: opt.value }))}
                    className={`p-4 rounded-xl border-2 text-center transition ${formData.renterType === opt.value ? "border-purple-600 bg-purple-50" : "border-gray-200 hover:border-purple-300"}`}
                  >
                    <div className="text-2xl mb-1">{opt.icon}</div>
                    <div className="font-medium text-gray-700">{opt.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Available From Month *</label>
                <select
                  name="availableMonth"
                  value={formData.availableMonth}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-purple-400 focus:outline-none text-gray-800"
                >
                  <option value="">Select Month</option>
                  {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                <select
                  name="availableYear"
                  value={formData.availableYear}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-purple-400 focus:outline-none text-gray-800"
                >
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i).map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}

        {/* Step 3: Contact & Images */}
        {step === 3 && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-purple-400">
                <FaPhone className="text-gray-400" />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="01XXXXXXXXX (11 digits)"
                  className="flex-1 focus:outline-none text-gray-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-purple-400">
                <FaEnvelope className="text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={currentUser.email}
                  className="flex-1 focus:outline-none text-gray-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Main Property Image URL *</label>
              <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-purple-400">
                <FaImage className="text-gray-400" />
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/property-image.jpg"
                  className="flex-1 focus:outline-none text-gray-800"
                />
              </div>
              {formData.image && (
                <div className="mt-3 h-40 rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                </div>
              )}
            </div>
          </>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-between pt-2">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => { setError(""); setStep((s) => s - 1); }}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition"
            >
              Back
            </button>
          ) : <div />}

          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold px-8 py-2.5 rounded-xl hover:from-purple-700 hover:to-blue-700 transition"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold px-8 py-2.5 rounded-xl hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-60"
            >
              {loading ? "Publishing..." : "Publish Listing"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
