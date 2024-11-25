const Tour = require("../models/tourModel");
const mongoose = require("mongoose");

// GET /tours
const getAllTours = async (req, res) => {
  const user_id = req.user._id;

  try {
    const tours = await Tour.find({ user_id }).sort({ createdAt: -1 });
    res.status(200).json(tours);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve tours" });
  }
};

// POST /tours
const createTour = async (req, res) => {
  const { name, info, image, price } = req.body;
  const user_id = req.user._id;

  try {
    const newTour = new Tour({
      name: name,
      info: info,
      image: image,
      price: price,
      user_id,
    });

    await newTour.save();
    res.status(201).json(newTour);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// GET /tours/:tourId
const getTourById = async (req, res) => {
  const { tourId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tourId)) {
    return res.status(400).json({ message: "Invalid tour ID" });
  }

  try {
    const tour = await Tour.findById(tourId);
    if (tour) {
      res.status(200).json(tour);
    } else {
      res.status(404).json({ message: "Tour not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve tour" });
  }
};

// PUT /tours/:tourId
const updateTour = async (req, res) => {
  const { tourId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tourId)) {
    return res.status(400).json({ message: "Invalid tour ID" });
  }

  try {
    const updatedTour = await Tour.findOneAndUpdate(
      { _id: tourId },
      { ...req.body },
      { new: true }
    );
    if (updatedTour) {
      res.status(200).json(updatedTour);
    } else {
      res.status(404).json({ message: "Tour not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to update tour" });
  }
};

// DELETE /tours/:tourId
const deleteTour = async (req, res) => {
  const { tourId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tourId)) {
    return res.status(400).json({ message: "Invalid tour ID" });
  }

  try {
    const user_id = req.user._id;
    const tour = await Tour.findByIdAndDelete({
      _id: tourId,
      user_id: user_id,
    });
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }
    res.status(204).send(); // 204 No Content
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
};
