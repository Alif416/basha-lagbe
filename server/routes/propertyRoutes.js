import express from "express";
import Property from "../models/property.js";

const router = express.Router();

// Add a property
router.post("/add", async (req, res) => {
  try {
    const newProperty = new Property(req.body);
    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a property
router.put("/update/:id", async (req, res) => {
  try {
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProperty) return res.status(404).json({ message: "Property not found" });
    res.status(200).json(updatedProperty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a property
router.delete("/delete/:id", async (req, res) => {
  try {
    const deleted = await Property.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Property not found" });
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch a single property (and increment view count)
router.get("/get/:id", async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch all properties with search, filter, sort, pagination
router.get("/all", async (req, res) => {
  try {
    const {
      search = "",
      location = "",
      renterType = "",
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      furnished,
      parking,
      isAvailable,
      division,
      sort = "createdAt",
      order = "desc",
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { district: { $regex: search, $options: "i" } },
      ];
    }

    if (location) query.location = { $regex: location, $options: "i" };
    if (division) query.division = { $regex: division, $options: "i" };
    if (renterType && renterType !== "all") query.renterType = renterType;
    if (minPrice !== undefined) query.price = { ...query.price, $gte: Number(minPrice) };
    if (maxPrice !== undefined) query.price = { ...query.price, $lte: Number(maxPrice) };
    if (bedrooms) query.bedrooms = { $gte: Number(bedrooms) };
    if (bathrooms) query.bathrooms = { $gte: Number(bathrooms) };
    if (furnished === "true") query.furnished = true;
    if (parking === "true") query.parking = true;
    if (isAvailable !== undefined) query.isAvailable = isAvailable === "true";

    const skip = (Number(page) - 1) * Number(limit);
    const sortObj = { [sort]: order === "asc" ? 1 : -1 };

    const [properties, total] = await Promise.all([
      Property.find(query).sort(sortObj).skip(skip).limit(Number(limit)),
      Property.countDocuments(query),
    ]);

    res.status(200).json({
      properties,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch total number of properties
router.get("/total/properties", async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments();
    const availableProperties = await Property.countDocuments({ isAvailable: true });
    res.json({ totalProperties, availableProperties });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get recent properties for home page
router.get("/recent", async (req, res) => {
  try {
    const properties = await Property.find({ isAvailable: true })
      .sort({ createdAt: -1 })
      .limit(6);
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
