import User from "../models/User.js";
import { generateToken } from "../utils/jwtHelper.js";
import { OAuth2Client } from "google-auth-library";

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const user = await User.create({
      firstname,
      lastname,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        token: generateToken(user._id),
        user: {
          id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          hasCompletedWizard: user.hasCompletedWizard,
          wizardData: user.wizardData,
        },
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        hasCompletedWizard: user.hasCompletedWizard,
        wizardData: user.wizardData,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Verify token
// @route   GET /api/auth/verify
// @access  Private
export const verifyToken = (req, res) => {
  res.json({ isValid: true, user: req.user });
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      financialProfile,
      profilePicture,
      currentPassword,
      password,
    } = req.body;

    // Add .select('+password') to include the password field
    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Rest of your function remains unchanged
    // Update basic profile information
    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (profilePicture) user.profilePicture = profilePicture;

    // Update financial profile if provided
    if (financialProfile) {
      user.financialProfile = {
        ...user.financialProfile,
        ...financialProfile,
      };
    }

    // Handle password update if both current and new password are provided
    if (currentPassword && password) {
      // Verify current password
      const isPasswordMatch = await user.matchPassword(currentPassword);

      if (!isPasswordMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      // Update to new password
      user.password = password;
    } else if (
      (currentPassword && !password) ||
      (!currentPassword && password)
    ) {
      // If only one password field is provided
      return res.status(400).json({
        message:
          "Both current password and new password are required to update password",
      });
    }

    const updatedUser = await user.save();

    // Don't send password back in response
    res.json({
      id: updatedUser._id,
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
      email: updatedUser.email,
      profilePicture: updatedUser.profilePicture,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete user account
// @route   DELETE /api/auth/account
// @access  Private
export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);

    if (user) {
      res.json({ message: "Account deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
