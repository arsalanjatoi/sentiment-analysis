// sentiment-analysis-app/src/App.js

import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [sentiment, setSentiment] = useState(null);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeSentiment = async () => {
    setLoading(true);
    setError(null);
    setSentiment(null);
    setScore(null);

    try {
      const response = await axios.post('/api/sentiment', { text });
      if(response.data[0].label){
        var sentiment = response.data[0].label.split("_");
        console.log(sentiment)
        if(sentiment[1] == "1"){
sentiment = 'Neutral'
        }else if(sentiment[1] == "0"){
          sentiment = 'Negitive'
        }else if(sentiment[1] == "2"){
          sentiment = 'Positive'
        }
      }
      setSentiment(sentiment);
      setScore(response.data[0].score.toFixed(4));
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      analyzeSentiment();
    }
  };

  return (
    <div className="App">
      <h1>Sentiment Analysis App</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="4"
          cols="50"
          placeholder="Enter text to analyze..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        ></textarea>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Sentiment'}
        </button>
      </form>

      {error && <p className="error">Error: {error}</p>}

      {sentiment && (
        <div className="result">
          <h2>Sentiment: {sentiment}</h2>
          <p>Confidence Score: {score}</p>
        </div>
      )}
    </div>
  );
}

export default App;
