import React from "react";

function QnaCardDetailsubmit({
  answers,
  qna,
  handleAnswerChange,
  handleAnswerSubmit,
}) {
  return (
    <>
      <div className="qna-answers">
        <i className="fi fi-tc-arrow-turn-down-right"></i>
        <textarea
          value={
            answers[qna.qnaAdminId] ||
            `${qna.name}님, 안녕하세요.
남겨주신 문의 사항을 확인하여 답변 드립니다.`
          }
          className="qna-actions-input"
          onChange={(e) => handleAnswerChange(qna.qnaAdminId, e.target.value)}
        ></textarea>
      </div>
      <div className="answer-button-area">
        <input
          type="button"
          value="답변 등록"
          className="qna-modify-button"
          onClick={() => handleAnswerSubmit(qna.qnaAdminId)}
        />
      </div>
    </>
  );
}
export default QnaCardDetailsubmit;
