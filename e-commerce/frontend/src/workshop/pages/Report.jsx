import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import WsModal from "../components/WsModal";
import "../css/Report.css";

function Report({ ownerId }) {
  const { workshopId, name } = useParams();

  const [qna, setQna] = useState([]);

  // ✅ 탭 상태 (기본: 대기)
  const [activeTab, setActiveTab] = useState("all"); // all, completed, pending

  // ✅ 모달
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectQna, setSelectQna] = useState(null);

  // ✅ 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const size = 10;

  useEffect(() => {
    axios({
      method: "post",
      url: "http://localhost:9090/workshop/report/view",
      params: { workshopId },
    })
      .then((res) => setQna(res.data))
      .catch((err) => console.log(err));
  }, [workshopId]);

  // ✅ 상태별 필터링
  const filteredQna = qna.filter((item) => {
    if (activeTab === "completed") return item.status === "답변완료";
    if (activeTab === "pending") return item.status === "대기";
    return true; // 전체
  });

  // ✅ 페이징 계산
  const startIndex = (currentPage - 1) * size;
  const currentList = filteredQna.slice(startIndex, startIndex + size);

  const totalPages = Math.ceil(filteredQna.length / size);

  const changeTab = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // 탭 바꾸면 1페이지로
  };

  const openModal = (qna) => {
    setSelectQna(qna);
    setIsModalOpen(true);
  };

  return (
    <div className="ws-report-container ws-costom-font">
      <h3 className="ws-report-title">공방 {name}의 소비자 문의</h3>

      <div className="ws-tab">
        <button
          className={`ws-button ${activeTab === "all" ? "active" : ""}`}
          onClick={() => changeTab("all")}
        >
          전체
        </button>
        <button
          className={`ws-button ${activeTab === "completed" ? "active" : ""}`}
          onClick={() => changeTab("completed")}
        >
          답변완료
        </button>
        <button
          className={`ws-button ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => changeTab("pending")}
        >
          대기
        </button>
      </div>

      <div className="ws-table-wrapper">
        <table className="ws-qna-table">
          <thead>
            <tr>
              <th>프로그램 명</th>
              <th>제목</th>
              <th>고객 명</th>
              <th>상태</th>
              <th>비고</th>
            </tr>
          </thead>

          <tbody>
            {currentList.length === 0 ? (
              <tr>
                <td colSpan="5">등록된 질문이 없습니다.</td>
              </tr>
            ) : (
              currentList.map((qna) => (
                <tr key={qna.qnaId}>
                  <td>{qna.programTitle}</td>
                  <td>{qna.title}</td>
                  <td>{qna.name}</td>
                  <td
                    className={
                      qna.status === "답변완료"
                        ? "ws-qna-status-completed"
                        : "ws-qna-status-pending"
                    }
                  >
                    {qna.status}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="ws-view-button"
                      onClick={() => openModal(qna)}
                    >
                      보기
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          ◀
        </button>

        {(() => {
          const groupSize = 10;
          const groupStart =
            Math.floor((currentPage - 1) / groupSize) * groupSize + 1;
          const groupEnd = Math.min(groupStart + groupSize - 1, totalPages);

          const pages = [];
          for (let p = groupStart; p <= groupEnd; p++) {
            pages.push(
              <button
                key={p}
                className={currentPage === p ? "active" : ""}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </button>
            );
          }
          return pages;
        })()}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          ▶
        </button>
      </div>

      <WsModal
        isActive={isModalOpen}
        type="reportContent"
        data={selectQna}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default Report;
