import React from "react";
import "../css/Modal.css";

// isOpen: 모달이 열려있는지 여부 (true/false)
// onClose: 모dal을 닫는 함수
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) {
    return null;
  }

  return (
    // 1. 모달 뒷배경 (Backdrop)
    //    이 부분을 클릭하면 onClose 함수가 호출되어 모달이 닫힙니다.
    <div className="modal-backdrop" onClick={onClose}>
      {/* 2. 실제 모달 콘텐츠 */}
      {/* e.stopPropagation()은 배경을 클릭한 것으로 간주되지 않도록 이벤트 전파를 막습니다. */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* 3. 닫기 버튼 */}
        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>

        {children}
      </div>
    </div>
  );
}

export default Modal;
