import React from "react";
import Modal from "../../Modal";

function NotificationModal({ notification, isModalOpen, closeModal }) {
  return (
    <Modal isOpen={isModalOpen} onClose={closeModal}>
      {notification ? (
        <div className="message-modal">
          <div className="message-header">알림 메시지</div>
          <div className="message-area notification">
            <div className="message-header-bar">
              <div className="message-sender">
                발신자 :{" "}
                {notification.workshopName
                  ? notification.workshopName
                  : notification.name}
              </div>
            </div>
            <div className="message-box">{notification.message}</div>
            <div className="message-footer-bar">
              <div className="send-time">
                발송 시간 : {notification.createdAt}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="loading">불러오는 중...</div>
      )}
    </Modal>
  );
}

export default NotificationModal;
