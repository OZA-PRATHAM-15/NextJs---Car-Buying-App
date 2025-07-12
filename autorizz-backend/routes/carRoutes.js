const express = require("express");
const router = express.Router();
const Car = require("../models/Car");
const HoverAnalytics = require("../models/HoverAnalytics");
const FilterAnalytics = require("../models/FilterAnalytics");
const {
  authenticateUser,
  roleCheck,
} = require("../middlewares/authenticateUser");
const CarVisitAnalytics = require("../models/CarVisitAnalytics");

router.get("/", async (req, res) => {
  const { search, type, minPrice, maxPrice } = req.query;
  const filter = {};

  if (search) {
    filter.$or = [
      { name: new RegExp(search, "i") },
      { description: new RegExp(search, "i") },
    ];
  }

  if (type) {
    filter.type = type;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseInt(minPrice, 10);
    if (maxPrice) filter.price.$lte = parseInt(maxPrice, 10);
  }

  try {
    const cars = await Car.find(filter);
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cars", error: err });
  }
});

router.get("/type/:type", async (req, res) => {
  const carType = req.params.type;
  const { minPrice, maxPrice, fuel, transmission, search } = req.query;

  try {
    let filterQuery = { type: carType };

    if (minPrice) filterQuery.price = { $gte: Number(minPrice) };
    if (maxPrice)
      filterQuery.price = { ...filterQuery.price, $lte: Number(maxPrice) };
    if (fuel) filterQuery["specifications.fuel_type"] = fuel;
    if (transmission) filterQuery["specifications.transmission"] = transmission;
    if (search) {
      filterQuery.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const cars = await Car.find(filterQuery);

    if (cars.length === 0) {
      return res
        .status(404)
        .json({ message: `No cars found matching your filters.` });
    }

    res.json(cars);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", authenticateUser, roleCheck("Admin"), async (req, res) => {
  const { name, description, image, price, type } = req.body;

  if (!name || !description || !image || !price || !type) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newCar = new Car({
      name,
      description,
      image,
      price,
      type,
      available: true,
    });

    const savedCar = await newCar.save();
    res.status(201).json(savedCar);
  } catch (error) {
    res.status(500).json({ message: "Error adding new car", error });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCar = await Car.findByIdAndDelete(id);
    if (!deletedCar) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting car", error });
  }
});

router.post("/hover", async (req, res) => {
  const { carId, userId } = req.body;

  try {
    const hoverExists = await HoverAnalytics.findOne({
      carId,
      userId,
      timestamp: { $gt: new Date(Date.now() - 6 * 1000) },
    });

    if (!hoverExists) {
      await HoverAnalytics.create({ carId, userId });
      res.status(201).json({ message: "Hover event logged" });
    } else {
      res.status(200).json({ message: "Hover event already logged" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to log hover event", error });
  }
});

router.post("/filter", async (req, res) => {
  const { filters, userId } = req.body;

  try {
    await FilterAnalytics.create({ filters, userId });
    res.status(201).json({ message: "Filter event logged" });
  } catch (error) {
    res.status(500).json({ message: "Failed to log filter event", error });
  }
});

router.get("/recommendations", async (req, res) => {
  const { type, minPrice, maxPrice } = req.query;

  try {
    const filter = {};

    if (type) filter.type = type;
    if (minPrice) filter.price = { $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
    const recommendations = await Car.find(filter).limit(10);

    if (!recommendations || recommendations.length === 0) {
      return res.status(404).json({
        message: "No recommendations found for the specified criteria.",
      });
    }

    res.status(200).json(recommendations);
  } catch (error) {
    console.error("Error fetching recommendations:", error.message);
    res.status(500).json({ message: "Error fetching recommendations", error });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const car = await Car.findById(id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ message: "Error fetching car details", error });
  }
});

router.post("/visit", async (req, res) => {
  const { carId, userId } = req.body;
  if (!carId) {
    return res.status(400).json({ message: "Car ID is required" });
  }
  try {
    const visit = await CarVisitAnalytics.create({ carId, userId });
    res.status(201).json({ message: "Visit logged successfully", visit });
  } catch (error) {
    res.status(500).json({ message: "Failed to log visit", error });
  }
});

module.exports = router;
