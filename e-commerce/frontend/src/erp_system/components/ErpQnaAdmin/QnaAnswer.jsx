import React from "react";

function QnaAnswer({ qna }) {
  return (
    <div className="detail-block">
      <strong>관리자 답변</strong>
      <p>{qna.answer}</p>
    </div>
  );
}
export default QnaAnswer;
