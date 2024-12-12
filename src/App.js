// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import notebookData from './data/mockNotebook.json';

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

  useEffect(() => {
    // Load notebook content from the mock JSON data
    const formattedNotebook = notebookData.cells
      .map(cell => {
        if (cell.cell_type === "markdown") {
          return cell.source.join('\n');
        } else if (cell.cell_type === "code") {
          return `\n\`\`\`python\n${cell.source.join('')}\n\`\`\`\n`;
        }
        return '';
      })
      .join('\n');

    setNotebookContent(formattedNotebook);
  }, []);

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
          <pre>{notebookContent}</pre>
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
