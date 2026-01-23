// src/workshop/components/MessageForm.jsx
import React, { useState } from "react";
import axios from "axios";
import "../css/MessageForm.css";
import "../css/WsModal.css"; // WsModal.css를 참조하여 공유 클래스를 사용합니다.

function MessageForm({ idList, title, workshopId, programId, onClose }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) {
      alert("메시지를 입력해주세요.");
      return;
    }

    const payload = {
      senderId: null,
      targetType: "CUSTOMER",
      workshopId: workshopId,
      message: `${title} - ${message}`,
      type: programId ? "WISH" : "FOLLOW",
      idList: idList,
    };

    axios
      .post("http://localhost:9090/workshop/send/message", payload)
      .then(() => {
        alert("알림이 발송되었습니다!");
        setMessage("");
        if (onClose) onClose();
      })
      .catch((err) => {
        console.error(err);
        alert("알림 발송에 실패했습니다.");
      });
  };

  return (
    <div className="ws-message-form">
      <h4>{programId ? "위시" : "팔로워"} 메세지 발송</h4>
      <hr />
      <textarea
        className="ws-form-textarea"
        placeholder="메시지를 입력하세요..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <div className="ws-modal-action-buttons">
        <button onClick={handleSend}>보내기</button>
        {onClose && (
          <button onClick={onClose} className="ws-close-button">
            닫기
          </button>
        )}
      </div>
    </div>
  );
}

export default MessageForm;
