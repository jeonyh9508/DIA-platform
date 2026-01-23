import React, { useState } from "react";
import "../../css/ApprovalModal.css";

function ProgramApprovalModal({ program, isOpen, closeModal, onSubmit }) {
  const [reason, setReason] = useState("");

  if (!isOpen || !program) return null;

  const formatDate = (dateString) => dateString?.slice(0, 10);

  const handleClose = () => {
    setReason("");
    closeModal();
  };

  const handleApproval = (type) => {
    if (type == "거절" && reason.trim() === "") {
      alert("거절 사유를 입력해주세요!");
      return;
    }

    if (!window.confirm(`해당 프로그램을 ${type}하시겠습니까?`)) {
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
          <div className="approval-modal-title">프로그램 상세 정보</div>
          <span className={`approval-status-badge status-${program.approved}`}>
            {program.approved}
          </span>

          <div className="approval-modal-content">
            <div
              className={`approval-image-box ${
                program.thumb == null ? "no-image" : ""
              }`}
            >
              {program.thumb != null ? (
                <img
                  src={`http://localhost:9090/upload/workshop/${program.workshopId}/program/${program.programId}/${program.thumb}`}
                  alt="프로그램 썸네일"
                />
              ) : (
                <p>이미지 없음</p>
              )}
            </div>

            <div className="approval-section">
              <div className="approval-section-title">기본 정보</div>
              <div className="approval-info-grid">
                <div className="label">공방명</div>
                <div className="value">{program.name}</div>

                <div className="label">프로그램명</div>
                <div className="value">{program.title}</div>

                <div className="label">카테고리</div>
                <div className="value">{program.category}</div>

                <div className="label">가격</div>
                <div className="value">{program.price.toLocaleString()}원</div>

                <div className="label">난이도</div>
                <div className="value">{program.difficulty}</div>
              </div>
            </div>

            <div className="approval-section">
              <div className="approval-section-title">프로그램 설명</div>
              <div className="desc-content">{program.description}</div>
            </div>

            <div className="approval-section">
              <div className="approval-section-title">운영 정보</div>
              <div className="approval-info-grid">
                <div className="label">진행 시간</div>
                <div className="value">{program.durationMin}분</div>

                <div className="label">개설 방식</div>
                <div className="value">
                  {program.scheduleType === "ALWAYS" ? "정기" : "기간"}
                </div>
                {program.scheduleType === "PERIOD" && (
                  <>
                    <div className="label">운영 기간</div>
                    <div className="value">
                      {formatDate(program.periodStart)} ~{" "}
                      {formatDate(program.periodEnd)}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="approval-section">
              <div className="approval-section-title">신청자 정보</div>
              <div className="approval-info-grid">
                <div className="label">공방주</div>
                <div className="value">{program.userName}</div>
                <div className="label">이메일</div>
                <div className="value">{program.email}</div>
                <div className="label">신청일시</div>
                <div className="value">{program.createdAt}</div>
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

export default ProgramApprovalModal;
