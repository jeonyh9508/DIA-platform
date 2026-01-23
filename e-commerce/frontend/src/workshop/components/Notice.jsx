import React, { useEffect, useState } from "react";
import "../css/Notice.css";

function Notice({ workshopId, notice, readMark }) {
  const [notification, setNotification] = useState(notice);

  useEffect(() => {
    setNotification(notice);
  }, [notice]);

  const handleRead = (notificationId) => {
    readMark(notificationId, workshopId);
    setNotification((prev) =>
      prev.map((n) =>
        n.notificationId === notificationId ? { ...n, viewed: true } : n
      )
    );
  };

  return (
    <div className="ws-notice-container">
      <div className="ws-notice-title">알림</div>
      {notification.length > 0 ? (
        <ul className="ws-notice-list">
          {notification.map((n) => (
            <li key={n.notificationId} className="ws-notice-item">
              <div
                className="ws-notice-content-wrapper"
                onClick={() => handleRead(n.notificationId)}
                style={{ cursor: "pointer" }}
              >
                <span className="ws-notice-message">
                  {n.message} /{" "}
                  <span className="ws-notice-date">{n.createdAt}</span>
                </span>
                {!n.viewed && <span className="ws-modal-red-dot"></span>}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="ws-notice-empty">알림 내역이 없습니다.</p>
      )}
      <div className="ws-modal-action-buttons"></div>
    </div>
  );
}

export default Notice;
