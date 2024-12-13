// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import notebookData from './data/mockNotebook.json';
import lorenzData from './data/Lorenz.json';

function App() {
  const [hintRequest, setHintRequest] = useState({
    request_id: 1,
    question_id: "Q12345",
    hint_type: "General",
    reflection_question: "What challenges did you face?",
    reflection_answer: "I struggled to understand recursion.",
    AI_hint: "Think about breaking the problem into smaller parts.",
    student_notes: "Please provide examples of recursion.",
  });
  const [taFeedback, setTaFeedback] = useState('');
  const [notebookContent, setNotebookContent] = useState("");

  const renderNotebook = () => {

    let nb = lorenzData.cells.map((cell) => {
      if (cell.cell_type === "markdown") {
        return (
          <div className="notebook-cell">
            <p>{cell.source}</p>
          </div>
        );
      } else if (cell.cell_type === "code") {
        return (
          <div className="notebook-cell">
            <pre>{cell.source}</pre>
          </div>
        );
      }
    });
    return (
      <pre>
        {nb}
      </pre>
    )
  }



  // Mock function to simulate fetching a new request
  const fetchRequest = () => {
    setHintRequest({
      request_id: 2,
      question_id: "Q54321",
      hint_type: "Specific",
      reflection_question: "How did you approach the problem?",
      reflection_answer: "I tried to use a loop but got stuck.",
      AI_hint: "Consider using recursion instead of a loop.",
      student_notes: "Need help understanding recursion better."
    });
  };

  // Mock function to simulate submitting feedback
  const submitFeedback = () => {
    alert(`Feedback submitted: ${taFeedback}`);
    setTaFeedback('');
    fetchRequest();
  };
  

  return (
    <div className="app">
      <header>
        <h1>TA Feedback Interface</h1>
      </header>
      <main className="main-content">
        <div className="notebook-view">
          <h2>Student Notebook</h2>
          {renderNotebook()}
        </div>
        <div className="hint-area">
          {hintRequest ? (
            <div className="hint-request">
              <h2>Request {hintRequest.request_id}</h2>
              <p><strong>Question:</strong> {hintRequest.question_id}</p>
              <p><strong>Hint Type:</strong> {hintRequest.hint_type}</p>
              <p><strong>Reflection Question:</strong> {hintRequest.reflection_question}</p>
              <p><strong>Student Reflection Answer:</strong> {hintRequest.reflection_answer}</p>
              <p><strong>AI Hint:</strong> {hintRequest.AI_hint}</p>
              <p><strong>Student Notes:</strong> {hintRequest.student_notes}</p>

              <textarea
                value={taFeedback}
                onChange={(e) => setTaFeedback(e.target.value)}
                placeholder="Write a hint below..."
              ></textarea>
              <button onClick={submitFeedback}>Submit Hint</button>
            </div>
          ) : (
            <p>No pending requests. Please check back later.</p>
          )}
        </div>
      </main>
      <footer>
        <button onClick={fetchRequest}>Next</button>
      </footer>
    </div>
  );
}

export default App;
