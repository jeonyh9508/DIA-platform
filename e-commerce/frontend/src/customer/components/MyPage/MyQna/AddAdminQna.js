import React, { useState } from "react";
import axios from "axios";
import "../../../css/MyQnaModal.css";

function AddAdminQna({ userId, onClose }) {
  const location = window.location;
  const [form, setForm] = useState({
    title: "",
    content: "",
  });

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
    // 등록 전 확인창
    if (!window.confirm("관리자에게 문의를 등록하시겠습니까?")) return;
    try {
      await axios.post("http://localhost:9090/customer/my-qna/insert-qna", {
        userId,
        title: form.title,
        content: form.content,
      });

      alert("관리자에게 문의가 등록되었습니다.");
      onClose(); // 모달 닫기
      window.location.reload();
    } catch (err) {
      console.error("관리자 문의 등록 오류:", err);
      alert("문의 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="add-admin-qna">
      <h2 className="qna-form-title">관리자에게 문의하기</h2>

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
            문의 등록
          </button>
          <button type="button" className="cancel-btn" onClick={onClose}>
            닫기
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddAdminQna;
