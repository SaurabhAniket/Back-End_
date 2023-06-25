import mongoose from 'mongoose';

const { Schema } = mongoose;

const testSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  // Add any additional fields specific to the Test model
  duration: {
    type: Number,
    required: true,
  },
});

const Test = mongoose.model('Test', testSchema);

export default Test;
