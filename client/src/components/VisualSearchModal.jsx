import { useState } from "react";
import { Link } from "react-router-dom";
import { useAI } from "../context/AIContext";

const VisualSearchModal = ({ isOpen, onClose }) => {
  const { searchByImage, visualResults, loading, lastQuery } = useAI();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  if (!isOpen) return null;

  const onFileChange = (event) => {
    const selected = event.target.files?.[0];
    setFile(selected || null);
    setPreview(selected ? URL.createObjectURL(selected) : "");
  };

  const handleSearch = async () => {
    if (!file) return;
    await searchByImage(file);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal ai-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Visual Search</h3>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="modal-form ai-modal-content">
          <input type="file" accept="image/*" onChange={onFileChange} className="form-input" />
          {preview && <img src={preview} alt="preview" className="ai-preview" />}

          <button className="btn btn-primary" onClick={handleSearch} disabled={!file || loading}>
            {loading ? "Searching..." : "Find Similar Products"}
          </button>

          {lastQuery && <p className="ai-query">AI Intent: {lastQuery}</p>}

          {visualResults.length > 0 && (
            <div className="ai-results-grid">
              {visualResults.map((product) => (
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

export default VisualSearchModal;
