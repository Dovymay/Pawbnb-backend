const express = require('express');
const PetStay = require('../models/PetStay.model');
const { isAuthenticated } = require('../middleware/isAuth');

const router = express.Router();

// GET all
router.get('/', async (req, res, next) => {
  try {
    const stays = await PetStay.find().populate('host');
    res.status(200).json(stays);
  } catch (error) {
    next(error);
  }
});

// GET one
router.get('/:id', async (req, res, next) => {
  try {
    const stay = await PetStay.findById().populate('host');
    res.status(200).json(stay);
  } catch (error) {
    next(error);
  }
});

// POST Create
router.post('/', isAuthenticated, async (req, res, next) => {
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

// PUT Update
router.put('/:id', isAuthenticated, async (req, res, next) => {
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

// DELETE
router.delete('/:id', isAuthenticated, async (req, res, next) => {
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

module.exports = router;
