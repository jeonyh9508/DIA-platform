import axios from "axios";
import React, { useEffect, useState } from "react";
import "../css/ActionLog.css";

import SettlementModal from "../settlement/components/SettlementModal";
import ProgramApprovalModal from "../components/ProgramApproval/ProgramApprovalModal";
import WorkshopApprovalModal from "../components/WorkshopApproval/WorkshopApprovalModal";
import { useNavigate } from "react-router-dom";

function ActionLog() {
  const navigate = useNavigate();
  const [actionLog, setActionLog] = useState([]);
  const [logId, setLogId] = useState(null);
  const [logReason, setLogReason] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [targetType, setTargetType] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 10;

  useEffect(() => {
    setLoading(true);
    axios
      .post("http://localhost:9090/erp-system/admin/action-log", {
        targetType: targetType === "ALL" ? null : targetType,
        keyword: keyword,
        page: currentPage,
        limit: limit,
      })
      .then((res) => {
        const data = res.data.content || [];
        const pages = res.data.totalPages || 0;
        setActionLog(data);
        setTotalPages(pages);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [keyword, targetType, currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setKeyword(searchInput);
    setCurrentPage(1);
  };

  const openDetailModal = (targetType, targetId, targetName) => {
    setModalType(targetType);

    if (targetType === "SETTLEMENT") {
      axios
        .post("http://localhost:9090/erp-system/settlement/one", {
          settlementId: targetId,
        })
        .then((res) => {
          setModalData({ ...res.data, workshopName: targetName });
          setIsModalOpen(true);
        })
        .catch(console.error);
    }
    if (targetType === "QNA") {
      navigate("/erp-system/qna-admin");
    }
    if (targetType === "PROGRAM") {
      axios
        .post("http://localhost:9090/erp-system/program/detail", null, {
          params: { programId: targetId },
        })
        .then((res) => {
          setModalData(res.data);
          setIsModalOpen(true);
        })
        .catch(console.error);
    }
    if (targetType === "WORKSHOP") {
      axios
        .post("http://localhost:9090/erp-system/workshop/detail", null, {
          params: { workshopId: targetId },
        })
        .then((res) => {
          setModalData(res.data);
          setIsModalOpen(true);
        })
        .catch(console.error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
    setModalType(null);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) return <div className="erp-log-loading">불러오는 중...</div>;

  return (
    <div className="erp-log-page">
      <div className="erp-log-container">
        <h2 className="erp-log-title">관리자 활동 로그</h2>

        <div
          className="erp-log-controls"
          onClick={() => {
            setLogReason(false);
          }}
        >
          <div className="erp-log-filter">
            {["ALL", "SETTLEMENT", "PROGRAM", "WORKSHOP", "QNA"].map((type) => (
              <label key={type}>
                <input
                  type="radio"
                  name="targetType"
                  value={type}
                  checked={targetType === type}
                  onChange={(e) => {
                    setTargetType(e.target.value);
                    setSearchInput("");
                    setKeyword("");
                    setCurrentPage(1);
                  }}
                />
                {type === "ALL" && "전체"}
                {type === "SETTLEMENT" && "정산"}
                {type === "PROGRAM" && "프로그램"}
                {type === "WORKSHOP" && "공방"}
                {type === "QNA" && "관리자 문의"}
              </label>
            ))}
          </div>

          <form onSubmit={handleSearch} className="erp-log-search">
            <input
              type="text"
              placeholder="검색어 입력"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit">검색</button>
          </form>
        </div>

        <table className="erp-log-table">
          <thead className="erp-log-thead">
            <tr className="erp-log-tr">
              <th className="erp-log-th">NO</th>
              <th className="erp-log-th">유형</th>
              <th className="erp-log-th">대상</th>
              <th className="erp-log-th">처리</th>
              <th className="erp-log-th">책임자</th>
              <th className="erp-log-th">일시</th>
            </tr>
          </thead>

          <tbody className="erp-log-tbody">
            {actionLog.length === 0 ? (
              <tr className="erp-log-tr">
                <td className="erp-log-td" colSpan="6">
                  데이터가 없습니다.
                </td>
              </tr>
            ) : (
              actionLog.map((log) => (
                <React.Fragment key={log.actionLogId}>
                  <tr className="erp-log-tr">
                    <td className="erp-log-td">{log.actionLogId}</td>
                    <td className="erp-log-td">
                      {log.targetType === "SETTLEMENT" && "정산"}
                      {log.targetType === "PROGRAM" && "프로그램"}
                      {log.targetType === "WORKSHOP" && "공방"}
                      {log.targetType === "QNA" && "관리자 문의"}
                    </td>
                    <td
                      className="erp-log-td clickable"
                      onClick={() => {
                        setLogReason((prev) =>
                          logId === log.actionLogId ? !prev : true
                        );
                        setLogId(log.actionLogId);
                      }}
                    >
                      {log.targetName || "-"}
                    </td>
                    <td className="erp-log-td">{log.actionType}</td>
                    <td className="erp-log-td">{log.adminName}</td>
                    <td className="erp-log-td">{log.createdAt}</td>
                  </tr>

                  {logReason && logId === log.actionLogId && (
                    <tr className="erp-log-tr reason-row">
                      <td className="erp-log-td" colSpan="5">
                        <div className="log-reason-content">
                          {log.reason
                            ? log.reason
                                .split("/")
                                .map((line, index) => (
                                  <div key={index}>{line.trim()}</div>
                                ))
                            : "-"}
                        </div>
                      </td>
                      <td className="erp-log-td">
                        {log.targetType !== "QNA" && (
                          <button
                            className="erp-log-check-btn"
                            onClick={() =>
                              openDetailModal(
                                log.targetType,
                                log.targetId,
                                log.targetName
                              )
                            }
                          >
                            확인
                          </button>
                        )}
                        {log.targetType === "QNA" && (
                          <button
                            className="erp-log-check-btn"
                            onClick={() => navigate("/erp-system/qna-admin")}
                          >
                            이동
                          </button>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>

        <div
          className="erp-log-pagination"
          onClick={() => {
            setLogReason(false);
          }}
        >
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            이전
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </div>

        {modalType === "SETTLEMENT" && (
          <SettlementModal
            type="settlement"
            isActive={isModalOpen}
            data={modalData}
            onClose={closeModal}
          />
        )}

        {modalType === "PROGRAM" && (
          <ProgramApprovalModal
            program={modalData}
            isOpen={isModalOpen}
            closeModal={closeModal}
            onSubmit="log"
          />
        )}

        {modalType === "WORKSHOP" && (
          <WorkshopApprovalModal
            workshop={modalData}
            isOpen={isModalOpen}
            closeModal={closeModal}
            onSubmit="log"
          />
        )}
      </div>
    </div>
  );
}

export default ActionLog;
