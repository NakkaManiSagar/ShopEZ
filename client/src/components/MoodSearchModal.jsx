import { useState } from "react";
import { Link } from "react-router-dom";
import { useAI } from "../context/AIContext";

const MoodSearchModal = ({ isOpen, onClose }) => {
  const { searchByMood, moodResults, loading, lastQuery } = useAI();
  const [mood, setMood] = useState("");

  if (!isOpen) return null;

  const handleSearch = async () => {
    if (!mood.trim()) return;
    await searchByMood(mood.trim());
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal ai-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Mood Search</h3>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="modal-form ai-modal-content">
          <textarea
            className="form-input"
            rows={3}
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder='Try: "I need trendy shoes for a beach party"'
          />

          <button className="btn btn-primary" onClick={handleSearch} disabled={!mood.trim() || loading}>
            {loading ? "Finding..." : "Get Suggestions"}
          </button>

          {lastQuery && <p className="ai-query">AI Intent: {lastQuery}</p>}

          {moodResults.length > 0 && (
            <div className="ai-results-grid">
              {moodResults.map((product) => (
                <Link to={`/products/${product._id}`} key={product._id} className="ai-result-card" onClick={onClose}>
                  <img src={product.thumbnail || product.images?.[0]} alt={product.name} />
                  <p>{product.name}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodSearchModal;
