// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import notebookData from './data/mockNotebook.json';

import Markdown from 'marked-react';
import Lowlight from 'react-lowlight';
import python from 'highlight.js/lib/languages/python';
Lowlight.registerLanguage('py', python);

import { getOneHF, getAllHF, submitFeedback } from './utils/requests';

const taIdLS = window.localStorage.getItem('taId') || null;


function App() {
  const [hintRequest, setHintRequest] = useState(null);
  const [taFeedback, setTaFeedback] = useState('');
  const [notebookContent, setNotebookContent] = useState("");
  const [taId, setTaId] = useState(taIdLS);

  const renderNotebook = () => {
    if (typeof notebookContent === 'string') return <p>Loading...</p>
    let nb = notebookContent.cells.map((cell, i) => {
      if (typeof cell.source === 'object') cell.source = cell.source.join('')
      if (cell.cell_type === "markdown") {
        return (
          <div key={i} className="notebook-cell">
            <Markdown>{cell.source}</Markdown>
          </div>
        );
      } else if (cell.cell_type === "code") {
        let val = typeof cell.source === 'string' ? cell.source : ''
        return (
          <div key={i} className="notebook-cell">
            <Lowlight language="py" value={val}>
            </Lowlight>
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

  const handleTaIdSubmit = (e) => {
    console.log("TA ID: ", e.target[0].value);
    e.preventDefault();
    setTaId(e.target[0].value);
    window.localStorage.setItem('taId', e.target[0].value);
  }




  // Mock function to simulate submitting feedback
  const handleSubmitFeedback = async () => {
    // alert(`Feedback submitted: ${taFeedback}`);
    setTaFeedback('');
    await submitFeedback(taFeedback, taId, hintRequest.request_id);
  };

  const getOne = async () => {
    // getOneHF(1).t
    const data = await getOneHF();
    const body = JSON.parse(data.body);
    console.log("HF DATA: ", body, data, data.nrows);
    
    if (body.nrows === 0) {
      setHintRequest(null);
      return;
    }
    console.log("BODY AFTER IF: ", body);
    setHintRequest(body);
    setNotebookContent(JSON.parse(body.student_notebook));

  }

  useEffect(() => {
    async function fetchData() {
      const data = await getAllHF();
      const body = JSON.parse(data.body);
      console.log("ALL DATA: ", body);

    }
    fetchData();
    
    getOne();
  }, []);

  // if no ta id, prompt for it and dont render anything else
  if (!taId) {
    return (
      <div className="app">
        <header>
          <h1>TA Feedback Interface</h1>
          
        </header>
        <main className="main-content">
          <div className="ta-id-prompt">
            <h2>Enter your TA ID:</h2>
            <form 
                onSubmit={handleTaIdSubmit}
                >

              <input
                type="text"
                placeholder="TA ID"
              />
              <button>Submit</button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  if (!hintRequest) {
    return (
      <div className="app">
        <header>
          <h1>TA Feedback Interface</h1>
          <div>
            <form onSubmit={handleTaIdSubmit}>
              <label>TA ID:</label>
              <input type="text" placeholder="Enter uniqname" value={ taId ? taId : "Enter Uniq ID"} />
              <button style={{display: 'none'}}></button>
            </form>
          </div>
        </header>
        <main className="main-content">
          <div className="hint-area">
            <p>No pending requests. Please check back later.</p>
          </div>
        </main>
        <footer>
        </footer>
      </div>
    );
  }

  return (
    <div className="app">
      <header>
        <h1>TA Feedback Interface</h1>
        <div>
            <form onSubmit={handleTaIdSubmit}>
              <label>TA ID:</label>
              <input type="text" placeholder="Enter uniqname" value={ taId ? taId : "Enter Uniq ID"} />
              <button style={{display: 'none'}}></button>
            </form>
          </div>
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault(); // Prevents a new line in the textarea
                    handleSubmitFeedback();
                  }
                }}
              ></textarea>
              <button onClick={handleSubmitFeedback}>Submit Hint</button>
              <button onClick={getOne}>Next Request</button>
            </div>
          ) : (
            <p>No pending requests. Please check back later.</p>
          )}
        </div>
      </main>
      <footer>
      </footer>
    </div>
  );
}

export default App;
