import React, { useState } from "react";
import SettlementModal from "./SettlementModal";
import { useAuth } from "../../../App";

function SettlementStatus({ settlement, fetchSettlement, adminId }) {
  const { hasRole } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [settlementData, setSettlementData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const modalClose = () => {
    setIsModalOpen(false);
    setSettlementData(null);
  };

  const totalPages = Math.ceil(settlement.length / itemsPerPage);

  const currentData = settlement.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div>
      {settlement.length === 0 ? (
        <p className="settle-empty-message">조회된 데이터가 없습니다.</p>
      ) : (
        <>
          <table className="settle-table">
            <thead className="settle-table-header">
              <tr>
                <th>공방명</th>
                <th>공방주</th>
                <th>정산 대상 금액</th>
                <th>조정 금액</th>
                <th>최종 정산 금액</th>
                <th>계산서 발행일</th>
                <th>상태</th>
                {
                  hasRole(["SUPER", "SETTLEMENT"]) &&
                  <th>처리</th>
                }
                <th>승인자</th>
              </tr>
            </thead>
            <tbody className="settle-table-body">
              {currentData.map((s) => (
                <tr className="settle-table-row" key={s.settlementId}>
                  <td>{s.workshopName}</td>
                  <td>{s.ownerName}</td>
                  <td>{s.originCommission?.toLocaleString()}원</td>
                  <td>
                    {s.adjustAmount === 0
                      ? ""
                      : `${s.adjustAmount?.toLocaleString()}원`}
                  </td>
                  <td>{s.finalAmount?.toLocaleString()}원</td>
                  <td>{s.billDate.toLocaleString()}</td>

                  <td>
                    <span
                      className={`settle-status-badge settle-status-${s.status}`}
                    >
                      {s.status}
                    </span>
                  </td>

                  {
                    hasRole(["SUPER", "SETTLEMENT"]) && 
                    <td>
                      {s.status === "정산중" ? (
                        <button
                          className="settle-manage-btn"
                          onClick={() => {
                            setSettlementData(s);
                            setIsModalOpen(true);
                          }}
                        >
                          처리
                        </button>
                      ) : (
                        <button
                          className="settle-manage-btn"
                          onClick={() => {
                            setSettlementData(s);
                            setIsModalOpen(true);
                          }}
                        >
                          완료
                        </button>
                      )}
                    </td>
                  }

                  <td>{s.adminName ? s.adminName : "미처리"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="ws-pagination-container">
            <button
              className="ws-page-button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              이전
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`ws-page-button ${
                  currentPage === i + 1 ? "active" : ""
                }`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="ws-page-button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              다음
            </button>
          </div>
        </>
      )}

      <SettlementModal
        isActive={isModalOpen}
        onClose={modalClose}
        onUpdate={fetchSettlement}
        type="settlement"
        data={settlementData}
        adminId={adminId}
      />
    </div>
  );
}

export default SettlementStatus;
