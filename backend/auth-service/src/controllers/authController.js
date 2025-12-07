const jwt = require('jsonwebtoken');

const resetTokens = new Map();

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const token = jwt.sign({ email }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.status(201).json({ message: 'User registered', token, user: { email, name } });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = jwt.sign({ email }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ message: 'Login successful', token, user: { email } });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    resetTokens.set(email, resetToken);
    res.json({ message: 'Password reset link sent to email', resetToken });
  } catch (error) {
    res.status(500).json({ message: 'Failed to process request', error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const storedToken = resetTokens.get(decoded.email);
    if (storedToken !== token) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    resetTokens.delete(decoded.email);
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token', error: error.message });
  }
};
