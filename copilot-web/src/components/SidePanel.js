import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import AnimatedHeartbeat from "./AnimatedHeartbeat";
import ApiKeyModal from "./ApiKeyModal"; // Import the existing ApiKeyModal

const SidePanel = ({
  useKnowledgeBase,
  setUseKnowledgeBase,
  relevantDocuments,
  setRelevantDocuments,
  chatHistoryMessages,
  setChatHistoryMessages,
  setSelectedModel,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useState("gemma2-9b-it");
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  const handleOpenApiKeyModal = () => {
    setIsApiKeyModalOpen(true);
  };

  const handleCloseApiKeyModal = () => {
    setIsApiKeyModalOpen(false);
  };
  const handleSaveApiKey = (apiKey) => {
    localStorage.setItem("groqApiKey", apiKey);
    setIsApiKeyModalOpen(false);
    fetchModels(); // Refetch models with the new API key
  };
  const fetchModels = useCallback(async () => {
    const apiKey = localStorage.getItem("groqApiKey");
    if (!apiKey) {
      setNotification({ type: "error", message: "API key not found" });
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8000/list_models?api_key=${apiKey}`
      );
      const fetchedModels = response.data.data;
      setModels(fetchedModels);
      if (fetchedModels.length > 0) {
        const firstModel = fetchedModels[0].id;
        setCurrentModel(firstModel);
        setSelectedModel(firstModel);
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: "Failed to fetch models, Please refresh couple of times",
      });
    }
  }, [setSelectedModel]);

  const handleLoadData = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification(null);

    try {
      const response = await axios.post("http://localhost:8000/add_documents");
      setNotification({ type: "success", message: response.data.status });
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.error || "An error occurred"
        : "Failed to load data";
      setNotification({ type: "error", message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchModels();
  }, [fetchModels]);
  return (
    <div className="side-panel">
      <div className="logo-container">
        <img
          src="img/logo.png"
          alt="Sherlock Logo"
          className="logo"
          width="300"
        />
      </div>

      <AnimatedHeartbeat />

      <div className="features">
        <div className="toggle-container">
          <span className="toggle-label">Use Knowledge Base</span>
          <div
            className={`toggle-button ${useKnowledgeBase ? "active" : ""}`}
            onClick={() => setUseKnowledgeBase(!useKnowledgeBase)}
          >
            <div className="toggle-switch"></div>
          </div>
        </div>
        <div className="button-container">
          <button
            style={{ width: "48%" }}
            className={`load-data-button ${isLoading ? "disabled" : ""}`}
            onClick={handleLoadData}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Reload Docs"}
          </button>
          <button
            style={{ width: "48%" }}
            className={`load-data-button ${isLoading ? "disabled" : ""}`}
            onClick={handleOpenApiKeyModal}
          >
            Set API Key
          </button>
        </div>

        <h3>Chat Settings:</h3>
        <div className="input-container">
          <label htmlFor="modelSelect">Select Model:</label>
          <select
            id="modelSelect"
            onChange={(e) => {
              setSelectedModel(e.target.value);
              setCurrentModel(e.target.value);
            }}
            value={currentModel}
          >
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.id}
              </option>
            ))}
          </select>
        </div>
        <div className="input-container">
          <label htmlFor="relevantDocs">
            Relevant Documents to Include (No of Docs):
          </label>
          <input
            type="number"
            id="relevantDocs"
            value={relevantDocuments}
            onChange={(e) =>
              setRelevantDocuments(Math.max(1, parseInt(e.target.value) || 1))
            }
            min="1"
          />
        </div>

        <div className="input-container">
          <label htmlFor="chatHistory">Send Last Messages as History:</label>
          <input
            type="number"
            id="chatHistory"
            value={chatHistoryMessages}
            onChange={(e) =>
              setChatHistoryMessages(Math.max(1, parseInt(e.target.value) || 1))
            }
            min="0"
          />
        </div>
      </div>
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={handleCloseApiKeyModal}
        onSave={handleSaveApiKey}
      />
      {notification && (
        <div className={`notification ${notification.type}`}>
          <p>{notification.message}</p>
        </div>
      )}
    </div>
  );
};

export default SidePanel;
