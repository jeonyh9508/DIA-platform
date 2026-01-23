import React, { useState } from "react";
import NoticeDetail from "./NoticeDetail";
import "../../css/AdminNotice.css";

function NoticeBoard({ notice, adminId, setType, onUpdate }) {
  const [noticeId, setNoticeId] = useState(0);

  return (
    <div className="erp-an-board">
      {noticeId === 0 ? (
        <table className="erp-an-table">
          <thead>
            <tr>
              <th>대상</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
            </tr>
          </thead>
          <tbody>
            {notice.length > 0 ? (
              notice.map((n) => (
                <tr
                  key={n.adminNoticeId}
                  className="erp-an-table-row"
                  onClick={() => setNoticeId(n.adminNoticeId)}
                >
                  <td>{n.noticeType}</td>
                  <td>{n.noticeTitle}</td>
                  <td>{n.name}</td>
                  <td>{new Date(n.createdAt).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="erp-an-empty-message">
                  등록된 공지가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        <NoticeDetail
          adminNoticeId={noticeId}
          onClose={() => setNoticeId(0)}
          adminId={adminId}
          setType={setType}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
}

export default NoticeBoard;
