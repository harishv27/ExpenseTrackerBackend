const axios = require("axios");
const admin = require("../firebase/firebaseAdmin");
const User = require("../models/User");

/**
 * REGISTER user
 * (Just ensure Firebase has the same user)
 */
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Create user in Firebase Authentication
    const userRecord = await admin.auth().createUser({ email, password });

    // Also save in MongoDB
    const newUser = new User({
      firebaseUid: userRecord.uid,
      email: userRecord.email,
    });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      uid: userRecord.uid,
      email: userRecord.email,
    });
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * LOGIN user - returns Firebase ID token
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Use Firebase REST API to get ID token
    const apiKey = process.env.FIREBASE_API_KEY; // Add this in your .env
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );

    const { idToken, refreshToken, localId } = response.data;

    // Ensure user exists in MongoDB
    let user = await User.findOne({ firebaseUid: localId });
    if (!user) {
      user = new User({
        firebaseUid: localId,
        email,
      });
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      idToken, // ✅ this is what you'll use in Postman
      refreshToken,
      uid: localId,
    });
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    res.status(401).json({
      success: false,
      message:
        error.response?.data?.error?.message || "Invalid email or password",
    });
  }
};

/**
 * LOGOUT - optional (handled client-side)
 */
exports.logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logout successful (handled client-side)",
  });
};
