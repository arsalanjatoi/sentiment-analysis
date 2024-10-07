// backend/server.js

const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

// After loading dotenv
if (!process.env.HUGGINGFACE_API_KEY) {
    console.error('Error: HUGGINGFACE_API_KEY is not defined in the environment variables.');
    process.exit(1); // Exit if API key is missing
  } else {
    console.log('Hugging Face API Key loaded successfully.');
  }

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint for Sentiment Analysis
app.post('/api/sentiment', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'No text provided' });
  }

  try {
    const response = await axios.post(
    //   'https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english',
      'https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment',
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json(response.data[0]);
  } catch (error) {
    console.error('Error calling Hugging Face API:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to analyze sentiment' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
