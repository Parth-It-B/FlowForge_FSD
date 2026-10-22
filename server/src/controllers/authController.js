import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper to generate JWT token
const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'flowforge_super_secret_jwt_key_2026';
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn: '24h' }
  );
};

// Helper to attach token cookie to response
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user);

  const cookieOptions = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  };

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
};

// @route   POST /api/auth/register
// @desc    Register a new user (role defaults to 'user'; demo admin account via admin@flowforge.dev)
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists.',
      });
    }

    // Role assignment: standard users cannot assign themselves admin.
    // If the email is explicitly admin@flowforge.dev or first registered user, assign admin role.
    const userCount = await User.countDocuments();
    let assignedRole = 'user';
    if (userCount === 0 || email.toLowerCase() === 'admin@flowforge.dev') {
      assignedRole = 'admin';
    }

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/logout
// @desc    Log user out and clear cookie
export const logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'User logged out successfully.',
  });
};

// @route   GET /api/auth/me
// @desc    Get currently logged in user profile
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
