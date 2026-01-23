import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../css/MyQnaModal.css";

function ModifyAdminQna({ userId, onClose, qna }) {
  const location = window.location;
  const [form, setForm] = useState({
    title: "",
    content: "",
  });

  // 모달이 열릴 때 qna 값으로 초기화
  useEffect(() => {
    if (qna) {
      setForm({
        title: qna.title || "",
        content: qna.content || "",
      });
    }
  }, [qna]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    // 수정 전 확인창
    if (!window.confirm("문의를 수정하시겠습니까?")) return;

    try {
      await axios.put("http://localhost:9090/customer/my-qna/update-qna", {
        userId,
        qnaAdminId: qna.qnaAdminId, // 어떤 QnA 수정할지 식별
        title: form.title,
        content: form.content,
      });

      alert("문의가 수정되었습니다.");
      onClose(); // 모달 닫기
      location.reload(); // 페이지 새로고침
    } catch (err) {
      console.error("문의 수정 오류:", err);
      alert("문의 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="add-admin-qna">
      <h2 className="qna-form-title">관리자 문의 수정</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>제목</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="문의 제목을 입력해주세요"
          />
        </div>

        <div className="form-group">
          <label>내용</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="문의 내용을 입력해주세요"
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="submit-btn">
            문의 수정
          </button>
          <button type="button" className="cancel-btn" onClick={onClose}>
            닫기
          </button>
        </div>
      </form>
    </div>
  );
}

export default ModifyAdminQna;
