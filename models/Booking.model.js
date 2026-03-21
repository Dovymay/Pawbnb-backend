const { Schema, model } = require('mongoose');

const bookingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  petStay: {
    type: Schema.Types.ObjectId,
    ref: 'PetStay',
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const Booking = model('Booking', bookingSchema);

module.exports = Booking;
