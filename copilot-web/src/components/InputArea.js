import React, { useState } from "react";
import "../styles/InputArea.css";

const InputArea = ({ onSendMessage, onStopGeneration, isGenerating }) => {
  const [input, setInput] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
    }
  };

  return (
    <form className="input-area" onSubmit={handleSubmit}>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message here..."
        rows={3}
      />
      {isGenerating ? (
        <button type="button" onClick={onStopGeneration}>
          Stop
        </button>
      ) : (
        <button type="submit">Send</button>
      )}
    </form>
  );
};

export default InputArea;
