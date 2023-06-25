import mongoose from 'mongoose';

const { Schema } = mongoose;

const responseSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  test: {
    type: Schema.Types.ObjectId,
    ref: 'Test',
    required: true,
  },
  question: {
    type: Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  answers: [String],
  // Add any additional fields specific to the Response model
  score: {
    type: Number,
    required: true,
  },
});

const Response = mongoose.model('Response', responseSchema);

export default Response;
