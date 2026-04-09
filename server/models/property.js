import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  district: { type: String, default: "" },
  division: { type: String, default: "" },
  image: { type: String, required: true },
  images: { type: [String], default: [] },
  renterType: { type: String, enum: ["bachelor", "family", "any"], required: true },
  availableMonth: { type: Number, min: 1, max: 12, required: true },
  availableYear: { type: Number, min: 2023, max: 2100, required: true },
  phoneNumber: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^\d{11}$/.test(v),
      message: (props) => `${props.value} is not a valid 11-digit phone number!`,
    },
  },
  email: { type: String, required: true },
  bedrooms: { type: Number, default: 1 },
  bathrooms: { type: Number, default: 1 },
  area: { type: Number, default: 0 },
  floor: { type: Number, default: 0 },
  furnished: { type: Boolean, default: false },
  parking: { type: Boolean, default: false },
  amenities: { type: [String], default: [] },
  isAvailable: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  userRef: { type: String, default: "" },
  createdDate: { type: Date, default: Date.now },
}, { timestamps: true });

// Text index for search
propertySchema.index({ title: "text", location: "text", description: "text", district: "text" });

const Property = mongoose.model("Property", propertySchema);

export default Property;
