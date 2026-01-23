import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../css/AdminNotice.css";

function NoticeDetail({ adminNoticeId, onClose, adminId, onUpdate }) {
  const [noticeDetail, setNoticeDetail] = useState(null);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeContent, setNoticeContent] = useState("");
  const [noticeType, setNoticeType] = useState("사내");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!adminNoticeId) return;

    axios
      .get(
        `http://localhost:9090/erp-system/detail?adminNoticeId=${adminNoticeId}`
      )
      .then((res) => {
        setNoticeDetail(res.data);
        setNoticeTitle(res.data.noticeTitle);
        setNoticeContent(res.data.noticeContent);
        setNoticeType(res.data.noticeType);
      })
      .catch((err) => console.error(err));
  }, [adminNoticeId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!noticeTitle.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!noticeContent.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    const data = {
      noticeTitle,
      noticeContent,
      noticeType,
      userId: adminId,
      adminNoticeId: noticeDetail.adminNoticeId,
    };

    axios
      .post("http://localhost:9090/erp-system/notice-modi", data)
      .then((res) => {
        if (res.data === 1) {
          alert("공지사항이 수정되었습니다.");
          setNoticeDetail({ ...noticeDetail, ...data });
          setEditMode(false);
          onUpdate();
        } else {
          alert("수정 실패");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("수정 중 오류 발생");
      });
  };

  const noticeDel = (adminNoticeId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    axios
      .post("http://localhost:9090/erp-system/notice-del", {
        adminNoticeId: adminNoticeId,
      })
      .then((res) => {
        if (res.data === 1) {
          alert("성공적으로 삭제되었습니다.");
          onUpdate();
          onClose();
        }
      });
  };

  if (!noticeDetail)
    return <p className="erp-an-empty-message">정보가 없습니다.</p>;

  return (
    <div className="erp-an-detail">
      {editMode ? (
        <form className="erp-an-form" onSubmit={handleSubmit}>
          <input
            className="erp-an-input"
            name="noticeTitle"
            value={noticeTitle}
            onChange={(e) => setNoticeTitle(e.target.value)}
            placeholder="제목"
          />
          <select
            className="erp-an-select"
            name="noticeType"
            value={noticeType}
            onChange={(e) => setNoticeType(e.target.value)}
          >
            <option value="사내">사내</option>
            <option value="고객">고객</option>
          </select>
          <textarea
            className="erp-an-textarea"
            name="noticeContent"
            value={noticeContent}
            onChange={(e) => setNoticeContent(e.target.value)}
            placeholder="내용"
          />
          <div className="erp-an-form-btns">
            <button className="erp-an-btn" type="submit">
              수정
            </button>
            <button
              className="erp-an-btn erp-an-btn-cancel"
              type="button"
              onClick={() => setEditMode(false)}
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <div className="erp-an-view">
          <h2 className="erp-an-title">
            [{noticeDetail.noticeType} 공지] {noticeDetail.noticeTitle}
          </h2>
          <p className="erp-an-content">{noticeDetail.noticeContent}</p>
          <p className="erp-an-meta">
            작성자: {noticeDetail.name} | 작성일:{" "}
            {noticeDetail.createdAt.toLocaleString()}
          </p>
          <div className="erp-an-view-btns">
            <button className="erp-an-btn" onClick={onClose}>
              목록으로
            </button>
            {adminId === noticeDetail.userId && (
              <>
                <button
                  className="erp-an-btn"
                  onClick={() => setEditMode(true)}
                >
                  수정
                </button>
                <button
                  className="erp-an-btn erp-an-btn-cancel"
                  onClick={() => noticeDel(noticeDetail.adminNoticeId)}
                >
                  삭제
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NoticeDetail;
