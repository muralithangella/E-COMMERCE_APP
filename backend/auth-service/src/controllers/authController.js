const jwt = require('jsonwebtoken');

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
