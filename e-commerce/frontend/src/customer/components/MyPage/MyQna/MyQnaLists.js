import React from "react";
import { Link } from "react-router-dom";
import MyQnaActions from "./MyQnaActions";
import MyQnaDetail from "./MyQnaDetail";
import MyQnaHeader from "./MyQnaHeader";

function MyQnaLists({
  filteredQnas,
  visibleCount,
  toggleDetail,
  openIndex,
  setSelectedQna,
  setModalType,
  qnaDelete,
}) {
  return (
    <div className="qna-list">
      {filteredQnas.length === 0 ? (
        <div className="empty-message">문의 내역이 없습니다.</div>
      ) : (
        filteredQnas.slice(0, visibleCount).map((qna, index) => (
          // 문의 공방/관리자 구분
          <div
            key={
              qna.qnaType === "관리자"
                ? `admin-${qna.qnaAdminId}`
                : `workshop-${qna.qnaId}`
            }
            className="qna-item"
          >
            {/* 대기/답변완료, 프로그램명, 작성시간 */}
            <MyQnaHeader toggleDetail={toggleDetail} qna={qna} index={index} />

            {/* 내용 영역 */}
            <MyQnaDetail
              openIndex={openIndex}
              index={index}
              qna={qna}
              setSelectedQna={setSelectedQna}
              setModalType={setModalType}
              qnaDelete={qnaDelete}
            />
          </div>
        ))
      )}
    </div>
  );
}
export default MyQnaLists;
