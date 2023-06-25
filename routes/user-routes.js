import express from 'express';
import {
  getAllUser,
  login,
  signup,
  editPhoneNumber,
  submitTest,
} from '../controllers/user-controller';

const router = express.Router();

router.get('/', getAllUser);
router.post('/signup', signup);
router.post('/login', login);
router.post('/submit-test', submitTest);
router.put("/edit/phonenumber", editPhoneNumber);



export default router;

