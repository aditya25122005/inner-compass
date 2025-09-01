import React, { useState } from 'react';

function JournalPage() {
  const [content, setContent] = useState('');

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        console.log('Journal entry saved successfully!');
        alert('Journal entry saved successfully!');
        setContent(''); // Clear the text area
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
        <h2 className="card-title text-center mb-4">Write a New Journal Entry</h2>
        <div className="mb-3">
          <textarea
            className="form-control"
            rows="8"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="How are you feeling today? Write your thoughts here..."
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
