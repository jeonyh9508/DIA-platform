import React, { useEffect, useState } from "react";
import "../../css/NotificationPopup.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../App";

function NotificationModal({ notifications, setNotifications, onClose }) {
  const { user } = useAuth();
  const userId = user?.userId;

  const [expandedId, setExpandedId] = useState(null);

  function isWithinDays(dateString, days) {
    const now = new Date();
    const target = new Date(dateString);
    const diff = now - target;
    return diff / (1000 * 60 * 60 * 24) <= days;
  }

  const previewList = notifications
    .filter((n) => isWithinDays(n.createdAt, 14)) // 최근 14일
    .slice(0, 20); // 최대 20개

  function timeSince(dateString) {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date() - date) / 1000);

    const intervals = [
      { label: "년", seconds: 31536000 },
      { label: "개월", seconds: 2592000 },
      { label: "일", seconds: 86400 },
      { label: "시간", seconds: 3600 },
      { label: "분", seconds: 60 },
      { label: "초", seconds: 1 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count > 0) return `${count}${interval.label} 전`;
    }
    return "방금 전";
  }

  const expandMessage = (id) => {
    // 이미 열려 있던 항목 -> 접기
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }

    // 신규로 펼치는 경우
    setExpandedId(id);

    const item = notifications.find((n) => n.id === id);

    // 읽지 않은 경우에만 읽음 처리
    if (item && !item.viewed) {
      readMessage(id);
    }
  };

  const readMessage = (id) => {
    axios
      .post(
        `http://localhost:9090/customer/notification/update-notification?id=${id}`
      )
      .then(() => {
        // 알림 상태 업데이트
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, viewed: true } : n))
        );

        // 알림 상태 변경됨을 전역으로 알림
        window.dispatchEvent(new Event("notificationUpdated"));
      })
      .catch((err) => console.error("읽음 처리 오류:", err));
  };

  return (
    <div className="notification-popup">
      <div className="popup-header">
        <span>알림</span>
        <button className="popup-close-btn" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="popup-content">
        {notifications.length > 0 ? (
          <ul className="notification-list">
            {previewList.map((n) => {
              const isExpanded = expandedId === n.id;
              return (
                <li
                  key={n.id}
                  className={`notification-item ${isExpanded ? "open" : ""}`}
                  onClick={() => expandMessage(n.id)}
                >
                  <div className="notif-dot-wrap">
                    <div
                      className={`notif-dot ${n.viewed ? "read" : "unread"}`}
                    ></div>
                  </div>

                  <div className="notif-content">
                    {/* 메시지 — 상태에 따라 한 줄(ellipsis) 또는 여러 줄 */}
                    <div
                      className={`notif-message ${
                        isExpanded ? "expanded" : ""
                      } ${n.viewed ? "read" : "unread"}`}
                    >
                      {n.message}
                    </div>

                    <div className="notif-date">{timeSince(n.createdAt)}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="notification-empty">알림이 없습니다.</p>
        )}
      </div>

      <div className="popup-footer">
        <Link to="/customer/my-notification" className="link-to-list">
          알림함으로 이동
        </Link>
      </div>
    </div>
  );
}

export default NotificationModal;
