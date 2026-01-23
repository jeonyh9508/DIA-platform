import axios from "axios";
import React from "react";
import { useAuth } from "../../../App";

function QnaCardDetailModiDel({
  answers,
  qna,
  handleAnswerChange,
  handleAnswerSubmit,
  handleSearch,
}) {
  const { hasRole } = useAuth();
  const handleAnswerDelete = async (qnaAdminId) => {
    if( !hasRole(["SUPER", "CS"]) ) {
      alert("권한이 없습니다.")
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:9090/erp-system/qna-admin/admin-answer-delete",
        {
          qnaAdminId: qna.qnaAdminId,
          title: qna.title,
          content: qna.content,
          answer: answers[qnaAdminId] || "",
        }
      );
      if (response.data > 0) {
        if (!window.confirm("답변을 삭제하시겠습니까?")) {
          return;
        }
        alert("답변이 삭제되었습니다.");
        handleSearch();
        window.location.reload();
      }
    } catch (error) {
      console.error("답변 삭제 오류:", error);
      alert("답변 삭제 중 오류 발생");
    }
  };
  return (
    <>
      <div className="qna-answers">
        <textarea
          value={answers[qna.qnaAdminId] || qna.answer}
          className="qna-actions-input"
          onChange={(e) => handleAnswerChange(qna.qnaAdminId, e.target.value)}
        ></textarea>
      </div>
      <div className="answer-button-area">
        <input
          type="button"
          value="답변 수정"
          className="qna-modify-button"
          onClick={() => handleAnswerSubmit(qna.qnaAdminId)}
        />
        <input
          type="button"
          value="답변 삭제"
          className="qna-delete-button"
          onClick={() => handleAnswerDelete(qna.qnaAdminId)}
        />
      </div>
    </>
  );
}
export default QnaCardDetailModiDel;
