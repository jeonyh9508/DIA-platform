import React from "react";
import { Link } from "react-router-dom";

function MyQnaHeader({ toggleDetail, qna, index }) {
  return (
    <div className="qna-header" onClick={() => toggleDetail(index)}>
      <div className="qna-meta">
        <span className="qna-type">{qna.qnaType}</span>

        <span
          className={`qna-status ${qna.status === "답변완료" ? "done" : ""}`}
        >
          {qna.status}
        </span>

        <span className="qna-program">
          <Link
            to={
              qna.programId
                ? `http://localhost:3000/customer/program/${qna.programId}`
                : "#"
            }
            state={{ scrollToQna: true }}
            className="link"
          >
            {qna.programTitle || "관리자 문의"}
          </Link>
        </span>
      </div>

      <div className="qna-title">{qna.title}</div>
      <div className="qna-date">등록 {qna.createdAt}</div>
      <div className="qna-date">
        {qna.answeredAt ? `답변  ${qna.answeredAt}` : ""}
      </div>
    </div>
  );
}
export default MyQnaHeader;
