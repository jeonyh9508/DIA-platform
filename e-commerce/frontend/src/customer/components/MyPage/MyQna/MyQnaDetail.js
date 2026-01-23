import React from "react";
import MyQnaActions from "./MyQnaActions";

function MyQnaDetail({
  openIndex,
  index,
  qna,
  setSelectedQna,
  setModalType,
  qnaDelete,
}) {
  return (
    <div className={`qna-detail ${openIndex === index ? "open" : ""}`}>
      <div className="qna-content">
        <strong>문의 내용</strong>
        <pre>{qna.content}</pre>
      </div>

      <div className="qna-content">
        <strong>답변</strong>
        <pre>{qna.answer || "아직 답변이 없습니다."}</pre>
      </div>
      {/* 수정(관리자문의일 경우만), 삭제 버튼 */}
      <MyQnaActions
        qna={qna}
        setSelectedQna={setSelectedQna}
        setModalType={setModalType}
        qnaDelete={qnaDelete}
      />
    </div>
  );
}
export default MyQnaDetail;
