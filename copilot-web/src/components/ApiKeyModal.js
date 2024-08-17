import React, { useState } from "react";
import "../styles/ApiKeyModal.css"; // You'll need to create this CSS file

const ApiKeyModal = ({ isOpen, onClose, onSave }) => {
  const [apiKey, setApiKey] = useState("");

  const handleSave = () => {
    if (apiKey.trim()) {
      onSave(apiKey);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Enter Groq API Key</h2>
        <p>
          Please enter your Groq API key to continue. You can generate an API
          key in the
          <a
            href="https://console.groq.com/keys"
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            Groq Console
          </a>
          .
        </p>
        <input
          type="text"
          placeholder="Enter your Groq API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="api-key-input"
        />
        <div className="modal-actions">
          <button onClick={onClose} className="cancel-button">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className="save-button"
          >
            Save API Key
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
