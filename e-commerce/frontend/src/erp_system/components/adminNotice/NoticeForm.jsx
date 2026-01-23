import React from "react";
import axios from "axios";
import "../../css/AdminNotice.css";

function NoticeForm({ adminId, onUpdate, setType }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const f = e.target;

    if (!f.noticeTitle.value.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!f.noticeContent.value.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    const data = {
      noticeTitle: f.noticeTitle.value,
      noticeContent: f.noticeContent.value,
      noticeType: f.noticeType.value,
      userId: adminId,
    };

    axios
      .post("http://localhost:9090/erp-system/write-notice", data)
      .then((res) => {
        if (res.data === 1) {
          alert("성공적으로 작성되었습니다.");
          onUpdate();
          setType("board");
        } else {
          alert("공지사항 작성에 실패했습니다.");
        }
      })
      .catch((err) => {
        console.error("공지사항 작성 중 오류 발생:", err);
        alert("공지사항 작성 중 오류가 발생했습니다.");
      });
  };

  return (
    <form className="erp-an-form" onSubmit={handleSubmit}>
      <input className="erp-an-input" name="noticeTitle" placeholder="제목" />
      <select className="erp-an-select" name="noticeType">
        <option disabled selected>
          대상 지정
        </option>
        <option value="사내">사내</option>
        <option value="고객">고객</option>
      </select>
      <textarea
        className="erp-an-textarea"
        name="noticeContent"
        placeholder="내용"
      />
      <div className="erp-an-form-btns">
        <button className="erp-an-btn" type="submit">
          작성
        </button>
        <button
          className="erp-an-btn erp-an-btn-cancel"
          type="button"
          onClick={() => setType("board")}
        >
          취소
        </button>
      </div>
    </form>
  );
}

export default NoticeForm;
