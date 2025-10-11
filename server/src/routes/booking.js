const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// ✅ Create a booking
router.post("/", async (req, res) => {
  try {
    const { instructor, student, skill, date, duration, notes } = req.body;

    if (!instructor || !student || !skill || !date || !duration) {
      return res.status(400).json({ message: "Missing required booking fields." });
    }

    const booking = new Booking({
      instructor,
      student,
      skill,
      date,
      duration,
      notes,
    });

    await booking.save();
    res.status(201).json({
      success: true,
      message: "Booking created successfully.",
      booking,
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(500).json({ message: "Error creating booking", error: error.message });
  }
});

// ✅ Get all bookings for a student
router.get("/student/:id", async (req, res) => {
  try {
    const bookings = await Booking.find({ student: req.params.id })
      .populate("instructor", "name email")
      .populate("skill");
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
});

// ✅ Get all bookings for an instructor
router.get("/instructor/:id", async (req, res) => {
  try {
    const bookings = await Booking.find({ instructor: req.params.id })
      .populate("student", "name email")
      .populate("skill");
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
});

// ✅ Update booking status
router.patch("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ message: "Error updating booking", error: error.message });
  }
});

module.exports = router;
