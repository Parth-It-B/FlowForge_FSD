import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
} from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import {
  validateRegister,
  validateLogin,
} from '../middleware/validateMiddleware.js';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/logout', verifyToken, logout);
router.get('/me', verifyToken, getMe);

export default router;
