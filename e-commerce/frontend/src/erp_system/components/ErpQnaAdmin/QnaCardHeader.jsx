import React, { useState } from "react";
import axios from "axios";
import "./QnaCardHeader.css";
import QnaCustomerInfoModal from "./QnaCustomerInfoModal";
import QnaEmail from "./QnaEmail";

function QnaCardHeader({ toggleDetail, index, qna }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userDetail, setUserDetail] = useState(null);

  const handleUserClick = async (e) => {
    e.stopPropagation();

    try {
      const res = await axios.get("http://localhost:9090/customer/mypage", {
        params: { userId: qna.userId },
      });

      setUserDetail(res.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* ====== 카드 헤더 ====== */}
      <div className="qna-header" onClick={() => toggleDetail(index)}>
        <div className="qna-meta">
          <span className="qna-type">
            {qna.role === "CUSTOMER" ? "일반" : "공방"}
          </span>

          <span
            className={`qna-status ${qna.status === "답변완료" ? "done" : ""}`}
          >
            {qna.status}
          </span>

          <span className="qna-program qna-user" onClick={handleUserClick}>
            {qna.name}
          </span>
          {/* 문의자 이메일span, 이메일 작성 링크로 이동 */}
          <QnaEmail qna={qna} />
        </div>

        <div className="qna-title">{qna.title}</div>
        <div className="qna-date">등록 {qna.createdAt}</div>
        <div className="qna-date">
          {qna.answeredAt ? `답변 ${qna.answeredAt}` : ""}
        </div>
      </div>

      {/* ====== 포털로 모달 독립 렌더링 ====== */}
      <QnaCustomerInfoModal
        userDetail={userDetail}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
}

export default QnaCardHeader;
