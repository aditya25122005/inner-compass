import React, { useState } from 'react';

function JournalPage() {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState(''); // New state for mood

  const handleSave = async () => {
    try {
      // Check if both content and mood are selected before saving
      if (!content || !mood) {
        alert('Please enter your thoughts and select a mood.');
        return;
      }

      const response = await fetch('http://localhost:5000/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, mood }), // Sending both content and mood
      });

      if (response.ok) {
        console.log('Journal entry saved successfully!');
        alert('Journal entry saved successfully!');
        setContent(''); // Clear the text area
        setMood(''); // Clear the mood selection
      } else {
        console.error('Failed to save Journal entry');
        alert('Failed to save Journal entry');
      }
    } catch (e) {
      console.log("An Error Occured", e);
      alert("There was an error");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm p-4">
        <h2 className="card-title text-center mb-4">How are you feeling today?</h2>

        {/* Mood Selection Emojis */}
        <div className="d-flex justify-content-center mb-4">
          <button onClick={() => setMood('happy')} className={`btn btn-light me-2 ${mood === 'happy' ? 'shadow' : ''}`}>
            <span role="img" aria-label="happy" style={{ fontSize: '2rem' }}>😄</span>
          </button>
          <button onClick={() => setMood('calm')} className={`btn btn-light me-2 ${mood === 'calm' ? 'shadow' : ''}`}>
            <span role="img" aria-label="calm" style={{ fontSize: '2rem' }}>😌</span>
          </button>
          <button onClick={() => setMood('sad')} className={`btn btn-light me-2 ${mood === 'sad' ? 'shadow' : ''}`}>
            <span role="img" aria-label="sad" style={{ fontSize: '2rem' }}>😔</span>
          </button>
          <button onClick={() => setMood('angry')} className={`btn btn-light me-2 ${mood === 'angry' ? 'shadow' : ''}`}>
            <span role="img" aria-label="angry" style={{ fontSize: '2rem' }}>😠</span>
          </button>
        </div>

        <div className="mb-3">
          <textarea
            className="form-control"
            rows="8"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your thoughts here..."
          ></textarea>
        </div>
        <button
          className="btn btn-primary w-100"
          onClick={handleSave}>
          Save Entry
        </button>
      </div>
    </div>
  );
}

export default JournalPage;
