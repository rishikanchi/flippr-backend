const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.post('/like', async (req, res) => {
  const { token, book } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    user.likedBooks.push(book);
    await user.save();

    res.json({ msg: 'Book liked successfully', likedBooks: user.likedBooks });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET request to retrieve liked books
router.get('/like', async (req, res) => {
  const token = req.header('x-auth-token');
  console.log(token)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({ likedBooks: user.likedBooks });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
