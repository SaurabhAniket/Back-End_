import User from "../model/User";
import bcrypt from 'bcryptjs';
import axios from 'axios';
import Response from "../model/Response";
import Test from "../model/Test";
import Question from "../model/Question";

export const getAllUser = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
  if (!users) {
    return res.status(404).json({ message: "No User Found" });
  }
  return res.status(200).json({ users });
};

export const signup = async (req, res, next) => {
  const { name, email, password, phone_number } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
  if (existingUser) {
    return res.status(400).json({ message: "User Already Exists! Login Instead" });
  }
  const hashedPassword = bcrypt.hashSync(password);
  const user = new User({
    name,
    email,
    password: hashedPassword,
    phone_number: phone_number || ""
  });

  try {
    await user.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
  return res.status(201).json({ success: true, message: "Signed up successfully" });
};


export const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
  if (!existingUser) {
    return res.status(404).json({ message: "User not Found" });
  }
  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Incorrect Password" });
  }

  let message;
  try {
    const response = await axios.get('https://api.catboys.com/catboy');
    message = response.data.message;
  } catch (err) {
    console.log(err);
    message = "Unable to fetch message";
  }

  return res.status(200).json({ success: true, message });
};

export const editPhoneNumber = async (req, res, next) => {
  const { phone_number } = req.body;
  const { userId } = req.user; // Assuming you have the userId in the request's authenticated user object

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.phone_number = phone_number;
    await user.save();

    return res.status(200).json({ success: true, message: "Phone number changed/added successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};


export const submitTest = async (req, res, next) => {
  try {
    // Parse the request body to extract the user ID, test ID, question ID, and answers
    const { userId, testId, responses } = req.body;

    // Validate the user ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate the test ID
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    // Retrieve the test and question details from the database
    const questions = await Question.find({ test: testId });

    // Calculate the score by comparing the user's answers with the correct answers
    let score = 0;
    for (const response of responses) {
      const question = questions.find((q) => q._id.toString() === response.questionId);
      if (question) {
        const isCorrect = response.answers.every((answer) => question.correctAnswers.includes(answer));
        if (isCorrect) {
          score++;
        }
      }
    }

    // Create a response object to store the user's responses, test details, and score
    const responseObj = new Response({
      user: userId,
      test: testId,
      responses,
      score,
    });

    // Save the response object in the database
    await responseObj.save();

    // Return the response object in the response body
    return res.status(200).json(responseObj);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};


