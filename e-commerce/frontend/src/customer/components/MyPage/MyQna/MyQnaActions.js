import React from "react";
import { useAuth } from "../../../../App";

function MyQnaActions({ qna, setSelectedQna, setModalType, qnaDelete }) {
  const { hasRole } = useAuth();

  // if( !hasRole(["SUPER", "CS"]) ) return null;

  return (
    <div className="qna-actions">
      {/* 관리자 QnA + 대기 상태일 때 수정 가능 */}
      {qna.status === "대기" && qna.qnaType === "관리자" && (
        <input
          type="button"
          value="수정"
          className="qna-modify-button"
          onClick={() => {
            setSelectedQna(qna);
            setModalType("modify");
          }}
        />
      )}

      <input
        type="button"
        value="삭제"
        className="qna-delete-button"
        onClick={() => qnaDelete(qna)}
      />
    </div>
  );
}
export default MyQnaActions;
