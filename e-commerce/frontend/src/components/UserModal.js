import React from 'react';
import '../components/UserModal.css';

function Modal({ isOpen, onClose, children, type }) {
  
  if (!isOpen) {
    return null;
  }
  const contentMouseDown = (e) => {
    e.stopPropagation(); 
  };
  
  const backdropMouseDown = (e) => {
      onClose();
  }

  return (
    <div className="modal-backdrop" onMouseDown={backdropMouseDown}>
      
      <div 
        className={`modal-content ${type}`} 
        onMouseDown={contentMouseDown}
        onClick={(e) => e.stopPropagation()}>
        
        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>
        
        {children}

      </div>
    </div>
  );
}

export default Modal;