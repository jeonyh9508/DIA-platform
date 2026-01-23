import React from "react";
import "../../../workshop/css/WsModal.css";
import SettlementApprove from "./SettlementApprove";

function SettlementModal({ isActive, onClose, onUpdate, type, data, adminId }) {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`ws-modal ${isActive ? "active" : ""}`}
      onMouseDown={handleOverlayClick}
    >
      <div className={`ws-modal-body`}>
        <button type="button" className="ws-modal-close-btn" onClick={onClose}>
          &times;
        </button>
        {type === "settlement" && data && (
          <SettlementApprove
            data={data}
            onClose={onClose}
            fetchSettlement={onUpdate}
            adminId={adminId}
          />
        )}
      </div>
    </div>
  );
}

export default SettlementModal;
