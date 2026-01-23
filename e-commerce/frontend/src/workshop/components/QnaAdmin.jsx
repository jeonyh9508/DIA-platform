import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";

function QnaAdmin({ ownerId, onClose }) {
  const [activeTab, setActiveTab] = useState("qna-list");
  const [qnaAdmin, setQnaAdmin] = useState([]);
  const [viewContentId, setViewContentId] = useState(null);

  const changeTab = (tab) => setActiveTab(tab);

  const fetchQna = useCallback(() => {
    axios
      .get(`http://localhost:9090/workshop/report/qna-admin?ownerId=${ownerId}`)
      .then((res) => setQnaAdmin(res.data))
      .catch((err) => console.log(err));
  }, [ownerId]);

  useEffect(() => {
    fetchQna();
  }, [fetchQna]);

  const [form, setForm] = useState({ title: "", content: "" });

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
    if (!window.confirm("관리자에게 문의를 등록하시겠습니까?")) return;

    try {
      await axios.post("http://localhost:9090/customer/my-qna/insert-qna", {
        userId: ownerId,
        title: form.title,
        content: form.content,
      });
      setForm({ title: "", content: "" });
      setActiveTab("qna-list");
      fetchQna();
      alert("관리자에게 문의가 등록되었습니다.");
    } catch (err) {
      console.error("관리자 문의 등록 오류:", err);
      alert("문의 등록 중 오류가 발생했습니다.");
    }
  };

  const del = (qnaAdminId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    axios
      .post(`http://localhost:9090/workshop/report/delete`, { qnaAdminId })
      .then((res) => {
        if (res.data === 1) {
          setQnaAdmin((prev) =>
            prev.filter((qna) => qna.qnaAdminId !== qnaAdminId)
          );
          alert("문의가 삭제되었습니다.");
        }
      })
      .catch((err) => {
        console.error("삭제 오류:", err);
        alert("삭제 중 오류가 발생했습니다.");
      });
  };

  return (
    <div className="ws-message-form">
      <h3 className="ws-qna-admin-title">문의 사항</h3>
      <div className="ws-tab">
        <button
          className={
            activeTab === "qna-list" ? "ws-button active" : "ws-button"
          }
          onClick={() => changeTab("qna-list")}
        >
          문의 내역 조회
        </button>
        <button
          className={
            activeTab === "qna-admin" ? "ws-button active" : "ws-button"
          }
          onClick={() => changeTab("qna-admin")}
        >
          관리자 문의
        </button>
      </div>

      {activeTab === "qna-list" ? (
        <table className="ws-qna-table">
          <thead>
            <tr>
              <th>문의 제목</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {qnaAdmin.length > 0 ? (
              qnaAdmin.map((qna) => (
                <tr key={qna.qnaAdminId}>
                  <td
                    onClick={() =>
                      setViewContentId(
                        viewContentId === qna.qnaAdminId ? null : qna.qnaAdminId
                      )
                    }
                  >
                    <div>
                      {qna.title} {qna.answer ? "(⭕)" : ""}
                    </div>
                    {viewContentId === qna.qnaAdminId && (
                      <div className="qna-content">
                        <div className="qna-section">
                          <strong>내용:</strong> {qna.content}
                        </div>
                        {qna.answer ? (
                          <div className="qna-section">
                            <strong>답변:</strong> {qna.answer}
                          </div>
                        ) : (
                          <div className="qna-section">
                            아직 답변이 없습니다.
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td>
                    <button
                      className="ws-button"
                      onClick={() => del(qna.qnaAdminId)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2}>등록된 문의가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <span>
              제목 :{" "}
              <input
                type="text"
                name="title"
                className="ws-form-input"
                value={form.title}
                onChange={handleChange}
                placeholder="문의 제목을 입력해주세요"
              />
            </span>
          </div>
          <div>
            <p>문의 내용:</p>
            <textarea
              name="content"
              className="ws-form-textarea"
              value={form.content}
              onChange={handleChange}
              placeholder="문의 내용을 입력해주세요"
            />
          </div>
          <div className="ws-modal-action-buttons">
            <button type="submit">전 송</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default QnaAdmin;
