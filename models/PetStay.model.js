const { Schema, model } = require('mongoose');

const petStaySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  pricePerNight: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    default:
      'https://img.freepik.com/premium-vector/animal-shelter-icon-clipart-avatar-logtotype-isolated-vector-illustration_955346-1219.jpg',
  },
  description: {
    type: String,
    default: '',
  },
  host: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
});

const PetStay = model('PetStay', petStaySchema);

module.exports = PetStay;
