import mongoose from 'mongoose';

const { Schema } = mongoose;

const questionSchema = new Schema({
  test: {
    type: Schema.Types.ObjectId,
    ref: 'Test',
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  options: [String],
  correctAnswers: [String],
  difficultyLevel: {
    type: String,
    enum: ['easy', 'medium', 'hard'], 
    default: 'medium',
  },
});

const Question = mongoose.model('Question', questionSchema);

export default Question;
