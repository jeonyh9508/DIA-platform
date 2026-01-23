import axios from "axios";
import React, { useEffect, useState } from "react";

function Unsettlement() {
  const [unsettled, setUnsettled] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    axios
      .post("http://localhost:9090/erp-system/settlement/unsettled")
      .then((res) => {
        setUnsettled(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const totalPages = Math.ceil(unsettled.length / itemsPerPage);
  const currentData = unsettled.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div>
      {unsettled.length === 0 ? (
        <p className="settle-empty-message">조회된 데이터가 없습니다.</p>
      ) : (
        <>
          <table className="settle-table">
            <thead className="settle-table-header">
              <tr>
                <th>공방명</th>
                <th>공방주</th>
                <th>공방 매출</th>
                <th>정산 예상 금액</th>
                <th>정산 대상 월</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody className="settle-table-body">
              {currentData.map((u) => (
                <tr
                  className="settle-table-row"
                  key={`${u.workshopId}-${u.monthly}`}
                >
                  <td>{u.workshopName}</td>
                  <td>{u.ownerName}</td>
                  <td>{u.totalAmount?.toLocaleString()}원</td>
                  <td>
                    {u.paidStatus === "정산대기" && (
                      <>{u.commissionAmt?.toLocaleString()}원</>
                    )}
                    {u.paidStatus === "조정" && (
                      <>{u.finalAmount?.toLocaleString()}원</>
                    )}
                  </td>
                  <td>{u.monthly}</td>
                  <td>
                    <span
                      className={`settle-status-badge settle-status-unsettled`}
                      style={{ backgroundColor: "#888" }}
                    >
                      {u.paidStatus}
                    </span>
                  </td>
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
    </div>
  );
}

export default Unsettlement;
