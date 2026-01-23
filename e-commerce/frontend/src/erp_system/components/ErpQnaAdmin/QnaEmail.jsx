import React from "react";

function QnaEmail({ qna }) {
  return (
    <span
      className="qna-program qna-email"
      onClick={(e) => {
        e.stopPropagation();
        const subject = encodeURIComponent(`[DIA 문의 답변 안내] ${qna.title}`);
        const body = encodeURIComponent(
          `안녕하세요, ${qna.name}님.\n\n문의주신 내용에 대한 답변드리겠습니다.\n\n---\n제목: ${qna.title}\n내용: ${qna.content}\n---\n\n답변 내용:\n\n여기에 답변을 작성해주세요.\n\n감사합니다.\nDIA 고객센터 드림.`
        );

        window.open(
          `mailto:${qna.email}?subject=${subject}&body=${body}`,
          "_blank"
        );
      }}
    >
      {qna.email}
    </span>
  );
}
export default QnaEmail;
