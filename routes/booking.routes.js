const express = require('express');
const Booking = require('../models/Booking.model');
const PetStay = require('../models/PetStay.model');
const { isAuthenticated } = require('../middleware/isAuth');

const router = express.Router();

// GET all bookings
router.get('/', async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.payload._id })
      .populate('user')
      .populate({
        path: 'petStay',
        populate: { path: 'host' },
      });
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
});

//Get one booking
router.get('/:id', isAuthenticated, async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user')
      .populate({
        path: 'petStay',
        populate: { path: 'host' },
      });

    res.json(booking);
  } catch (error) {
    next(error);
  }
});

// CREATE booking
router.post('/', isAuthenticated, async (req, res, next) => {
  try {
    const petStay = await PetStay.findById(req.body.petStay);

    const days =
      (new Date(req.body.endDate) - new Date(req.body.startDate)) /
      (1000 * 60 * 60 * 24);

    const totalPrice = days * petStay.pricePerNight;

    const booking = await Booking.create({
      ...req.body,
      user: req.payload._id,
      totalPrice,
    });

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
});

//UPDATE /bookings/:id
router.put('/:id', isAuthenticated, async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (booking.user.toString() !== req.payload._id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedBooking);
  } catch (error) {
    next(error);
  }
});

// DELETE /bookings/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (booking.user.toString() !== req.payload._id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Booking.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: `Booking ${req.params.id} deleted successfully` });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

// 💬 Final Feedback

// Your version:

// 👉 80% correct (good structure, nice populate usage)

// After fixes:

// 👉 Production-ready for a bootcamp project

// 🚀 What you should do next

// Now you’re ready to:

// 👉 connect bookings to frontend
// 👉 build MyBookings page
// 👉 create booking form
