import axios from "axios";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../css/ReportContent.css";

function ReportContent({ onClose, qna }) {
  const navigate = useNavigate();
  const { workshopId, name } = useParams();

  function answer(e) {
    const f = e.target;
    e.preventDefault();

    const data = {
      qnaId: f.qnaId.value,
      answer: f.answer.value,
    };

    axios
      .post("http://localhost:9090/workshop/report/answer", data)
      .then((res) => {
        alert("답변이 등록되었습니다.");
        navigate(`/workshop/report/view/${workshopId}/${name}`);
        onClose();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  if (!qna) return null;
  return (
    <div className="ws-report-content">
      <h4 className="ws-report-title">문의 상세보기</h4>

      <div className="ws-report-details-box">
        <p className="ws-detail-item">
          <b className="ws-detail-label">제목:</b> {qna.title}
        </p>
        <p className="ws-detail-item">
          <b className="ws-detail-label">내용:</b> {qna.content}
        </p>
        <p className="ws-detail-item">
          <b className="ws-detail-label">작성자:</b> {qna.name}
        </p>
        <p className="ws-detail-item">
          <b className="ws-detail-label">상태:</b> {qna.status}
        </p>
        <p className="ws-detail-item">
          <b className="ws-detail-label">질문일:</b> {qna.createdAt}
        </p>
        <p className="ws-detail-item">
          <b className="ws-detail-label">답변일:</b> {qna.answeredAt}
        </p>
      </div>

      {qna.answer == null ? (
        <div className="ws-answer-form">
          <form onSubmit={answer}>
            <input type="hidden" value={`${qna.qnaId}`} name="qnaId" />
            <textarea
              className="ws-answer-form-textarea"
              placeholder="답변을 입력하세요..."
              name="answer"
            />
            <div className="ws-modal-action-buttons">
              <button type="submit" className="ws-btn-primary">
                답변 등록
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="ws-answer-box">
          <div className="ws-answer-label">답변 내용</div>
          <p className="ws-answer-text">{qna.answer}</p>
        </div>
      )}
    </div>
  );
}
export default ReportContent;
