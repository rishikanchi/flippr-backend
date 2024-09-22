const Cerebras = require('@cerebras/cerebras_cloud_sdk');
const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/analyze', async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user.likedBooks.length) {
      return res.status(400).json({ msg: 'No liked books to analyze.' });
    }

    const titles = user.likedBooks.map(book => book.title).join(', ');

    const openaiResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a literary analyst specializing in inferring reader interests from book titles.' },
        { role: 'user', content: `Based on the following book titles: ${titles}, infer the user's main areas of interest for reading.` }
      ],
      max_tokens: 150,
    });

    const inferredInterests = openaiResponse.choices[0].message.content.trim();

    res.json({ inferredInterests });
  } catch (err) {
    console.error('Error analyzing books:', err);
    res.status(500).send('Server error');
  }
});

router.post('/summary', async (req, res) => {
  const { title } = req.body;

  try {
    if (!title) {
      return res.status(400).json({ msg: 'No book title provided.' });
    }

    const client = new Cerebras({
      apiKey: process.env.CEREBRAS_API_KEY, // This is the default and can be omitted
    });
    const completionCreateResponse = await client.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a literary analyst.' },
        { role: 'user', content: `In two to three sentences, give an overview on ${title} for someone who knows nothing about the book but doesn't want any spoilers.` }
      ],
      model: 'llama3.1-8b',
    });
    const summary = completionCreateResponse.choices[0].message.content.trim();
    res.json({ summary : summary });
  } catch (err) {
    console.error('Error generating summary:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;