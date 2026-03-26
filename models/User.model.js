
const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username is required.'],
    unique: true,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
  },
  role: {
    type: String,
    enum: ['user', 'host'],
    default: 'user',
  },
  avatar: {
    type: String,
    default: 'https://cdn-icons-png.freepik.com/512/4122/4122901.png',
  },
});

const User = model('User', userSchema);

module.exports = User;
