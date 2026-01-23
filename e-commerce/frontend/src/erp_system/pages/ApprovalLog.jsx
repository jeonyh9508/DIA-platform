import axios from "axios";
import React, { useEffect, useState } from "react";
import ApprovalLogList from "../components/ApprovalLog/ApprovalLogList";
import "../css/ApprovalList.css";
import Pagination from "../../components/Pagination";
import ApprovalLogFilterBar from "../components/ApprovalLog/ApprovalLogFilterBar";

function ApprovalLog() {
  const [approvalLog, setApprovalLog] = useState([]);

  const [filter, setFilter] = useState("ALL");
  const [keyword, setKeyword] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const [filterWorkshop, setFilterWorkshop] = useState(true);
  const [filterProgram, setFilterProgram] = useState(true);
  const [openRows, setOpenRows] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const size = 10;

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      searchApprovalLog();
    }
  }, [filter, keyword, filterWorkshop, filterProgram]);

  useEffect(() => {
    searchApprovalLog();
  }, [sortBy, sortDir, currentPage]);

  const searchApprovalLog = () => {
    axios
      .get("http://localhost:9090/erp-system/admin/approval-log", {
        params: {
          filter,
          keyword,
          sortBy,
          sortDir,
          page: currentPage,
          size: size,
          workshop: filterWorkshop,
          program: filterProgram,
        },
      })
      .then((res) => {
        setApprovalLog(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => {
        console.error("승인 로그 조회 실패:", err);
      });
  };

  const toggleSort = (column) => {
    if (sortBy === column) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortDir("asc");
    }
  };

  const toggleRow = (id) => {
    setOpenRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <main className="erp-approval-page">
      <h2 className="erp-page-title">승인 내역 로그</h2>

      <ApprovalLogFilterBar
        filterWorkshop={filterWorkshop}
        setFilterWorkshop={setFilterWorkshop}
        filterProgram={filterProgram}
        setFilterProgram={setFilterProgram}
        setFilter={setFilter}
        keywordInput={keywordInput}
        setKeywordInput={setKeywordInput}
        onSearch={() => setKeyword(keywordInput)}
      />

      <ApprovalLogList
        approvalLog={approvalLog}
        sortBy={sortBy}
        sortDir={sortDir}
        toggleSort={toggleSort}
        openRows={openRows}
        toggleRow={toggleRow}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </main>
  );
}

export default ApprovalLog;
