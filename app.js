import express from 'express';
import mongoose from 'mongoose';
import router from './routes/user-routes';
import User from './model/User';



const app = express();
const port = 5000;
app.get('/api/welcome', (req, res) => {
    // Return the success response
    res.status(200).json({
      success: true,
      message: 'API successfully called',
    });
  });
app.use(express.json())
app.use("/api/user",router);

app.put('/api/user/phonenumber', async (req, res) => {
  const { phone_number } = req.body;
  const { userId } = req.user;

  try {
    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the phone number
    user.phone_number = phone_number;

    // Save the updated user in the database
    await user.save();

    return res.status(200).json({ success: true, message: 'Phone number changed/added successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

mongoose
  .connect('mongodb+srv://admin:ZaZHU7hL2RbAEdi8@cluster0.qyom1yd.mongodb.net/Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // Start the server after successful database connection
    app.listen(port, () => {
      console.log(`Connected to the database and listening on Localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });


