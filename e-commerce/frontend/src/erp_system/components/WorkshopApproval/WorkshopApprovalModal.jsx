import React, { useState } from "react";
import "../../css/ApprovalModal.css";

function WorkshopApprovalModal({ workshop, isOpen, closeModal, onSubmit }) {
  const [reason, setReason] = useState("");

  if (!isOpen || !workshop) return null;

  const handleClose = () => {
    setReason("");
    closeModal();
  };

  const handleApproval = (type) => {
    if (type == "거절" && reason.trim() === "") {
      alert("거절 사유를 입력해주세요!");
      return;
    }

    if (!window.confirm(`해당 공방을 ${type}하시겠습니까?`)) {
      return;
    }

    onSubmit(type, reason);

    setReason("");
  };

  return (
    <div className="approval-modal-overlay" onClick={handleClose}>
      <div
        className="approval-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="approval-modal-scroll-area">
          <div className="approval-modal-title">공방 상세 정보</div>
          <span className={`approval-status-badge status-${workshop.approved}`}>
            {workshop.approved}
          </span>

          <div className="approval-modal-content">
            <div
              className={`approval-image-box ${
                workshop.profileImg == null ? "no-image" : ""
              }`}
            >
              {workshop.profileImg != null ? (
                <img
                  src={`http://localhost:9090/upload/workshop/${workshop.workshopId}/${workshop.profileImg}`}
                  alt="워크샵 이미지"
                />
              ) : (
                <p>이미지 없음</p>
              )}
            </div>

            <div className="approval-section">
              <div className="approval-section-title">기본 정보</div>
              <div className="approval-info-grid">
                <div className="label">공방명</div>
                <div className="value">{workshop.name}</div>

                <div className="label">대표번호</div>
                <div className="value">{workshop.contactNumber}</div>

                <div className="label">주소</div>
                <div className="value">{workshop.address}</div>
              </div>
            </div>

            <div className="approval-section">
              <div className="approval-section-title">공방 설명</div>
              <div className="desc-content">{workshop.description}</div>
            </div>

            <div className="approval-section">
              <div className="approval-section-title">신청자 정보</div>
              <div className="approval-info-grid">
                <div className="label">공방주</div>
                <div className="value">{workshop.userName}</div>

                <div className="label">이메일</div>
                <div className="value">{workshop.email}</div>

                <div className="label">신청일시</div>
                <div className="value">{workshop.createdAt}</div>
              </div>
            </div>
            {onSubmit !== "log" ? (
              <div className="approval-modal-footer">
                <textarea
                  placeholder="거절 시 사유를 적어주세요."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />

                <div className="approve-btn-group">
                  <button
                    className="approve-btn"
                    onClick={() => handleApproval("승인", reason)}
                  >
                    승인
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => handleApproval("거절", reason)}
                  >
                    거절
                  </button>
                </div>

                <button
                  className="approval-modal-close-btn"
                  onClick={handleClose}
                >
                  닫기
                </button>
              </div>
            ) : (
              <button
                className="approval-modal-close-btn"
                onClick={handleClose}
              >
                닫기
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkshopApprovalModal;
