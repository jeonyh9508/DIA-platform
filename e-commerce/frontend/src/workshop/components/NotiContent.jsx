import React, { useState, useEffect } from "react";
import "../css/NotiContent.css";
import { Link } from "react-router-dom";

function NotiContent({ data, onClose }) {
  const [content, setContent] = useState(data);

  useEffect(() => {
    if (data) {
      setContent(data);
      console.log(data);
    }
  }, [data]);

  if (!content) {
    return <div className="loading">불러오는 중...</div>;
  }

  return (
    <div className="noti-content">
      <div className="noti-header">알림 메시지</div>
      <div className="noti-body">
        <div className="noti-sender">
          발신자: {content.workshopName ? content.workshopName : content.name}
        </div>
        <div className="noti-message">{content.message}</div>
        <div className="noti-footer">발송 시간: {content.createdAt}</div>
        {content.type === "QNA" && (
          <Link
            to={`/workshop/report/view/${content.workshopId}/${content.workshopName}`}
            className="ws-link-button"
          >
            이동
          </Link>
        )}
        {content.type === "REVIEW" && (
          <Link to={`info/${content.workshopId}`} className="ws-link-button">
            이동
          </Link>
        )}
      </div>
    </div>
  );
}

export default NotiContent;
