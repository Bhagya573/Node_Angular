const User = require('../models/User');
const jwt = require('jsonwebtoken');
const logAction = require('../middlewares/actionLogger');

// Function to generate a JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Try to find the user by username
    let user = await User.findOne({ username });

    if (!user) {
      // If user doesn't exist, create a new one
      user = new User({ username, password });
      await user.save();
      logAction('User Created', `New user created with username: ${username}`);
    } else {
      // If user exists, check the password
      const isMatch = await user.matchPassword(password);
      logAction('Login Failed', `Failed login attempt for username: ${username}`);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    }
    logAction('User Logged In', `User logged in with username: ${username}`);
    // Generate JWT token
    const token = generateToken(user);
    return res.status(user.isNew ? 201 : 200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};
