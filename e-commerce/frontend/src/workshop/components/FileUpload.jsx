import React, { useState, useRef, useEffect } from "react";
import "../css/FileUpload.css";

function FileUpload({ label, type, onChange, initialPreviewUrl }) {
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef();
  
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current && initialPreviewUrl) {
      if (type === "single") {
        setPreviews([{ file: null, url: initialPreviewUrl }]);
      }
      isInitialized.current = true;
    }
  }, [initialPreviewUrl, type]);

  const handleFiles = (files) => {
    const newFiles = Array.from(files);
    const newPreviews = newFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    if (type === "single") {
      setPreviews(newPreviews.slice(0, 1));
      onChange(newFiles[0] || null);
    } else {
      setPreviews([...previews, ...newPreviews]);
      
      const allFiles = [...previews.map((p) => p.file), ...newFiles].filter(f => f !== null);
      onChange(allFiles);
    }
  };

  const handleInputChange = (e) => {
    handleFiles(e.target.files);
    e.target.value = null;
  };

  const handleRemove = (e, index) => {
    e.stopPropagation();

    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);

    const removedItem = previews[index];
    if (removedItem && removedItem.url.startsWith("blob:")) {
      URL.revokeObjectURL(removedItem.url);
    }

    if (type === "single") {
      onChange(null);
    } else {
      const validFiles = updated.map((p) => p.file).filter(f => f !== null);
      onChange(validFiles);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="file-upload-container">
      {label && <label className="file-upload-label">{label}</label>}
      <div className="preview-wrapper">
        {previews.map((p, idx) => (
          <div key={idx} className="preview-item" onClick={openFileDialog}>
            <img src={p.url} alt={`preview-${idx}`} />
            <button
              type="button"
              className="remove-btn"
              onClick={(e) => handleRemove(e, idx)}
            >
              ×
            </button>
          </div>
        ))}

        {!(type === "single" && previews.length > 0) && (
          <div className="add-btn" onClick={openFileDialog}>
            +
          </div>
        )}
      </div>

      <input
        type="file"
        style={{ display: "none" }}
        multiple={type === "multi"}
        ref={fileInputRef}
        onChange={handleInputChange}
        accept="image/*"
      />
    </div>
  );
}

export default FileUpload;