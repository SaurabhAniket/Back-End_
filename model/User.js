import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
  },
  // Add any additional fields specific to the User model
  role: {
    type: String,
    enum: ['admin', 'user'], // Example: User roles can be 'admin' or 'user'
    default: 'user',
  },
});

const User = mongoose.model('User', userSchema);

export default User;



