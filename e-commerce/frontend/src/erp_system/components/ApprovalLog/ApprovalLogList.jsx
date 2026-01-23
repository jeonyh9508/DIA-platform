import React from "react";
import SortButton from "../SortButton";

function ApprovalLogList({
  approvalLog,
  sortBy,
  sortDir,
  toggleSort,
  openRows,
  toggleRow,
}) {
  return (
    <div className="erp-table approval-log-table">
      <div className="erp-table-header">
        <span>대상</span>
        <span>
          공방/프로그램명
          <SortButton
            column="targetName"
            sortBy={sortBy}
            sortDir={sortDir}
            toggleSort={toggleSort}
          />
        </span>
        <span>소속 공방</span>
        <span>관리자</span>
        <span>상태</span>
        <span>
          일자
          <SortButton
            column="a.created_at"
            sortBy={sortBy}
            sortDir={sortDir}
            toggleSort={toggleSort}
          />
        </span>
        <span>사유</span>
      </div>

      <div className="erp-table-body">
        {approvalLog.length > 0 ? (
          approvalLog.map((a) => (
            <div
              className={`erp-table-row ${
                openRows[a.actionLogId] ? "open" : ""
              }`}
              key={a.actionLogId}
              onClick={() => toggleRow(a.actionLogId)}
            >
              <span className={`target-badge target-${a.targetType}`}>
                {a.targetType === "PROGRAM" ? "프로그램" : "공방"}
              </span>
              <span
                className={`long-text target-name-span ${
                  openRows[a.actionLogId] ? "expanded" : ""
                }`}
              >
                {a.targetName}
              </span>
              <span>{a.workshopName || "-"}</span>
              <span>{a.adminName}</span>
              <span className={`status-badge status-${a.actionType}`}>
                {a.actionType}
              </span>
              <span>{a.createdAt}</span>
              <span
                className={`long-text reason-span ${
                  openRows[a.actionLogId] ? "expanded" : ""
                }`}
              >
                {a.reason || "-"}
              </span>
            </div>
          ))
        ) : (
          <div className="empty-list">조회된 승인 로그 리스트가 없습니다.</div>
        )}
      </div>
    </div>
  );
}

export default ApprovalLogList;
