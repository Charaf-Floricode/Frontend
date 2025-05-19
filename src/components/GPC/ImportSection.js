// src/components/ImportSection.js
import React, { useState } from 'react';
import './Card.css';
import {runImport} from '../../services/api'; 


export default function ImportSection() {
  const [message, setMessage] = useState(null);
  const [file,    setFile]    = useState(null);
  const [debug,   setDebug]   = useState([]);
  const [loading, setLoading] = useState(false);

  const runimport = async () => {
    setLoading(true);
    setMessage(null);
    setFile(null);
    setDebug([]);
    try {
      const json = await runImport();
      setMessage(json.message);
      setFile(json.file);
      setDebug(json.debug || []);
    } catch (err) {
      setMessage('Error: ' + err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Import Excel</h2>
      <button onClick={runimport} disabled={loading}>
        {loading ? 'Importing…' : 'Import Excel'}
      </button>
      {message && <p>{message}</p>}
      {file && <p>File: <code>{file}</code></p>}
      {debug.length > 0 && (
        <ul>
          {debug.map((step,i) => <li key={i}>{step}</li>)}
        </ul>
      )}
    </div>
  );
}
