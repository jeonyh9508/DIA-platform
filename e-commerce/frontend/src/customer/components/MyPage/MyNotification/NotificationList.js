import React from "react";
import { Checkbox } from "@mui/material";

function NotificationList({
  myNotifications,
  selectedIds,
  clickCheckbox,
  openModal,
}) {
  return (
    <div className="notification-info">
      {myNotifications.length > 0 ? (
        myNotifications.map((n) => (
          <div
            key={n.id}
            className={`notification-card ${n.viewed ? "read" : "unread"}`}
            onClick={() => openModal(n.id)}
          >
            <Checkbox
              checked={selectedIds.includes(n.id)}
              onClick={(e) => e.stopPropagation()} // 모달로 클릭 이벤트 전파 방지
              onChange={() => clickCheckbox(n.id)}
            />

            <span className="notification-message">{n.message}</span>
            <span>{n.workshopName ? n.workshopName : n.name}</span>
            <span>{n.createdAt}</span>
          </div>
        ))
      ) : (
        <div className="empty-message">알림이 없습니다.</div>
      )}
    </div>
  );
}

export default NotificationList;
