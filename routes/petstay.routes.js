const express = require('express');
const PetStay = require('../models/PetStay.model');
const { isAuthenticated } = require('../middleware/isAuth');
const Booking = require('../models/Booking.model.js');
const router = express.Router();

//GET all
router.get('/', async (req, res, next) => {
  try {
    const stays = await PetStay.find().populate('host', '-password -__v');
    res.status(200).json(stays);
  } catch (error) {
    next(error);
  }
});

//Featured stay
router.get('/featured', async (req, res, next) => {
  try {
    const featuredStays = await PetStay.find({ featured: true }).populate(
      'host',
      '-password -__v'
    );

    res.json(featuredStays);
  } catch (error) {
    next(error);
  }
});

//Filtered by city
router.get('/location/:city', async (req, res, next) => {
  try {
    const { city } = req.params;

    const filteredStays = await PetStay.find({ location: city }).populate(
      'host',
      '-password -__v'
    );

    res.json(filteredStays);
  } catch (error) {
    next(error);
  }
});

//GET one
router.get('/:id', async (req, res, next) => {
  try {
    const stay = await PetStay.findById(req.params.id).populate(
      'host',
      '-password -__v'
    );
    res.status(200).json(stay);
  } catch (error) {
    next(error);
  }
});

//POST Create
router.post('/create', isAuthenticated, async (req, res, next) => {
  try {
    const newStay = await PetStay.create({
      ...req.body,
      host: req.payload._id,
    });
    res.status(201).json(newStay);
  } catch (error) {
    next(error);
  }
});

//PUT Update
router.put('/update/:id', isAuthenticated, async (req, res, next) => {
  try {
    const stay = await PetStay.findById(req.params.id);

    if (stay.host.toString() !== req.payload._id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedStay = await PetStay.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedStay);
  } catch (error) {
    next(error);
  }
});

//DELETE
router.delete('/delete/:id', isAuthenticated, async (req, res, next) => {
  const stay = await PetStay.findById(req.params.id);

  if (stay.host.toString() !== req.payload._id) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  try {
    const deletedStay = await PetStay.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: `Stay ${req.params.id} deleted successfully` });
  } catch (error) {
    next(error);
  }
});

router.post('/search', async (req, res, next) => {
  try {
    const { activeSearch } = req.body;
    const { city, startDate, endDate } = activeSearch;

    const filteredStays = await PetStay.find({ location: city });
    const idArr = filteredStays.map((s) => s._id);
    const bookingsByStay = await Booking.find({
      petStay: { $in: idArr },
      startDate: { $lte: new Date(endDate) },
      endDate: { $gt: new Date(startDate) },
    });

    const stayIdsBasedOnBooking = bookingsByStay.map((b) =>
      b.petStay.toString()
    );

    const availableStays = filteredStays.filter(
      (s) => !stayIdsBasedOnBooking.includes(s._id.toString())
    );

    res.json(availableStays);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
