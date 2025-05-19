import React, { useState } from 'react';
import './Card.css';
import { fetchHealth } from '../../services/api';
export default function HealthSection() {
  const [status,setStatus] = useState(null);
  const [time,setTime]     = useState(null);
  const [loading,setLoading] = useState(false);

  const checkHealth = async() => {
    setLoading(true);
    setStatus(null);
    try {
      const json = await fetchHealth();
      setStatus(json.status);
      setTime(json.time);
    } catch(err) {
      setStatus('error');
      setTime(err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Health Check</h2>
      <button onClick={checkHealth} disabled={loading}>
        {loading ? 'Checking…' : 'Check Health'}
      </button>
      {status && <p>Status: <strong>{status}</strong> at <em>{time}</em></p>}
    </div>
  );
}
