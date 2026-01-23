import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgramForm from "./ProgramForm";

function RejectReason({ type, id, onClose, ownerId, onSuccess }) {
  const navigate = useNavigate();
  const [reason, setReason] = useState(null);

  useEffect(() => {
    if (!id) return;
    if (type === "workshop") {
      axios
        .post("http://localhost:9090/workshop/reject-reason", {
          workshopId: id,
        })
        .then((res) => {
          setReason(res.data);
        })
        .catch((err) => console.log(err));
    } else if (type === "program") {
      axios
        .post("http://localhost:9090/workshop/program/reject-reason", {
          programId: id,
        })
        .then((res) => {
          setReason(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [id, type, ownerId]);

  return (
    <div className="ws-modal-content-block">
      {reason && type === "workshop" && (
        <div className="ws-reject-content-wrapper">
          <h3 className="ws-reject-title">{reason.name}</h3>

          <div className="ws-reject-status">
            승인 요청이 <strong>{reason.approved}</strong> 되었습니다.
          </div>

          <div className="ws-reason-box">
            <p className="ws-reason-label">사유 : </p>
            <p className="ws-reason-text">{reason.reason}</p>
          </div>

          <div className="ws-reject-action-buttons">
            <button
              className="ws-close-button"
              onClick={() => navigate(`/workshop/ws-modi/${reason.workshopId}`)}
            >
              수정
            </button>
            <button className="ws-close-button" onClick={onClose}>
              닫기
            </button>
          </div>
        </div>
      )}

      {reason && type === "program" && (
        <div className="ws-reject-content-wrapper">
          <h3 className="ws-reject-title">{reason.title}</h3>

          <div className="ws-reject-status">
            승인 요청이 <strong>{reason.approved}</strong> 되었습니다.
          </div>

          <div className="ws-reason-box">
            <p className="ws-reason-label">사유 : </p>
            <p className="ws-reason-text">{reason.reason}</p>
          </div>

          <div className="ws-retry-form">
            <h4>정보 수정 및 재신청</h4>
          </div>
          <ProgramForm
            programId={id}
            workshopId={reason.workshopId}
            onClose={() => {
              onClose();
            }}
            onSuccess={onSuccess}
            type="programReject"
          />
        </div>
      )}
    </div>
  );
}

export default RejectReason;
