// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import notebookData from './data/mockNotebook.json';

import Markdown from 'marked-react';
import Lowlight from 'react-lowlight';
import python from 'highlight.js/lib/languages/python';
Lowlight.registerLanguage('py', python);

import { getOneHF, getAllHF, submitFeedback, downloadNotebook } from './utils/requests';

const taIdLS = window.localStorage.getItem('taId') || null;


function App() {
  const [hintRequest, setHintRequest] = useState(null);
  const [taFeedback, setTaFeedback] = useState('');
  const [notebookContent, setNotebookContent] = useState("");
  const [taId, setTaId] = useState(taIdLS);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [allRequests, setAllRequests] = useState([]);

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
    console.log("TA ID: ", e);
    e.preventDefault();
    setTaId(e.target[0].value);
    window.localStorage.setItem('taId', e.target[0].value);
  }

  const hideStyle = feedbackSubmitted ? {opacity: '50%', }: {};



  // Mock function to simulate submitting feedback
  const handleSubmitFeedback = async () => {
    setTaFeedback('');
    await submitFeedback(taFeedback, taId, hintRequest.request_id);
    setFeedbackSubmitted(true);
  };

  const getOne = async (id) => {
    const data = await getOneHF(id);
    // console.log("HF DATA: ", data);
    const body = JSON.parse(data.body);
    // console.log("HF DATA: ", body, data, data.nrows);
    
    if (body.nrows === 0) {
      setHintRequest(null);
      return;
    }
    setHintRequest(body);
    setNotebookContent(JSON.parse(body.student_notebook));
    setFeedbackSubmitted(false);
  }

  useEffect(() => {
    // async function fetchData() {
    //   const data = await getAllHF();
    //   const body = JSON.parse(data.body);
    //   console.log("ALL DATA: ", body);
    //   setAllRequests(body);

    // }
    // fetchData();
    
    if (taId) getOne(taId);
  }, [taId]);

    // console.log("NOTEBOOK CONTENT: ", notebookContent);
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
            <form onSubmit={handleTaIdSubmit} 
                >

              <input
                type="text"
                placeholder="TA ID"
                
              />

              <button >Submit</button>
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
      <main className="main-content" >
        <div className="notebook-view" style={hideStyle}>
          <div className="notebook-header">
            <h2>Student Notebook</h2>
            <button 
              onClick={() => downloadNotebook(notebookContent, `${hintRequest.request_id}_SIADS505_TA_feedback.ipynb`)}
              disabled={feedbackSubmitted}
              >
                <span style={{fontSize: "1.2rem"}} >⭳</span> Download
            </button>
          </div>
          {renderNotebook()}
        </div>
        <div className="hint-area">
          {hintRequest ? (
            <div className="hint-request">
              <div 
                style={hideStyle}
                disabled={feedbackSubmitted}
              >
                <h2>Request {hintRequest.request_id}</h2>
                <p><strong>Question:</strong> {hintRequest.question_id ? hintRequest.question_id : "N/A"}</p>
                <p><strong>Hint Type:</strong> {hintRequest.hint_type ? hintRequest.hint_type : "N/A"}</p>
                <p><strong>Reflection Question:</strong> {hintRequest.reflection_question ? hintRequest.reflection_question : "N/A"}</p>
                <p><strong>Student Reflection Answer:</strong> {hintRequest.reflection_answer ? hintRequest.reflection_answer : "N/A"}</p>
                <p><strong>AI Hint:</strong> {hintRequest.AI_hint ? hintRequest.AI_hint : "N/A"}</p>
                <p><strong>Student Notes:</strong> {hintRequest.student_notes ? hintRequest.student_notes : "N/A"}</p>
              </div>

              <textarea
                style={hideStyle}
                disabled={feedbackSubmitted}
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
              <div className="hint-request-buttons">
                {feedbackSubmitted ? <button className='next-button' onClick={() => getOne(taId)} >Next Request</button> : <button onClick={handleSubmitFeedback}>Submit Hint</button>}
                
                
              </div>
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
