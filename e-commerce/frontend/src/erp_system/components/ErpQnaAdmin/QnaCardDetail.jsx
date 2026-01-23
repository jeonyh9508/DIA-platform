import axios from "axios";
import React, { useState } from "react";
import QnaCardDetailsubmit from "./QnaCardDetailSubmit";
import QnaCardDetailModiDel from "./QnaCardDetailModiDel";
import QnaAnswer from "./QnaAnswer";
import { useAuth } from "../../../App";

function QnaCardDetail({ index, openIndex, qna, handleSearch, userId }) {
  const { hasRole } = useAuth();
  const [answers, setAnswers] = useState({});

  const handleAnswerSubmit = async (qnaAdminId) => {
    const answerText = answers[qnaAdminId] || "";

    if( !hasRole(["SUPER", "CS"]) ) {
      alert("권한이 없습니다.")
      return;
    }

    if (!answerText.trim()) {
      alert("답변을 입력해주세요!");
      return;
    }

    if (!window.confirm("답변을 등록하시겠습니까?")) return;

    try {
      const response = await axios.post(
        "http://localhost:9090/erp-system/qna-admin/answer",
        {
          qnaAdminId: qnaAdminId,
          answer: answerText,
          title: qna.title, // 제목 전달
          content: qna.content, // 내용 전달
          adminId: userId, // 관리자 ID 전달
          userId: qna.userId,
        }
      );

      if (response.data > 0) {
        alert("답변이 등록되었습니다!");
        handleSearch();
        window.location.reload();
      }
    } catch (error) {
      console.error("답변 등록 오류:", error);
      alert("답변 등록 중 오류 발생");
    }
  };

  const handleAnswerChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };
  return (
    <div className={`erp-qna-detail ${openIndex === index ? "open" : ""}`}>
      <div className="detail-block">
        <strong>문의 내용</strong>
        <p>{qna.content}</p>
      </div>
      {qna.answer !== null && qna.answer && (
        // 관리자 답변
        <QnaAnswer qna={qna} />
      )}
      {qna.answer ? (
        // 답변 O --> 답변 수정란, 답변 수정 & 삭제 버튼
        <QnaCardDetailModiDel
          answers={answers}
          qna={qna}
          handleAnswerChange={handleAnswerChange}
          handleAnswerSubmit={handleAnswerSubmit}
          handleSearch={handleSearch}
        />
      ) : (
        // 답변 X --> 답변 등록란, 답변 등록 버튼
        <QnaCardDetailsubmit
          answers={answers}
          qna={qna}
          handleAnswerChange={handleAnswerChange}
          handleAnswerSubmit={handleAnswerSubmit}
        />
      )}
    </div>
  );
}
export default QnaCardDetail;
