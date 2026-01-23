import React from "react";
import SortButton from "../SortButton";
import { useAuth } from "../../../App";

function ProgramApprovalList({
  programList,
  sortBy,
  sortDir,
  toggleSort,
  openModal,
}) {
  const { hasRole } = useAuth();

  return (
    <div className="erp-table program-table">
      <div className="erp-table-header">
        <span>
          공방명
          <SortButton
            column="w.name"
            sortBy={sortBy}
            sortDir={sortDir}
            toggleSort={toggleSort}
          />
        </span>
        <span>
          프로그램명
          <SortButton
            column="p.title"
            sortBy={sortBy}
            sortDir={sortDir}
            toggleSort={toggleSort}
          />
        </span>
        <span>이메일</span>
        <span>상태</span>
        <span>
          신청일자
          <SortButton
            column="p.created_at"
            sortBy={sortBy}
            sortDir={sortDir}
            toggleSort={toggleSort}
          />
        </span>
        <span>비고</span>
      </div>

      <div className="erp-table-body">
        {programList.length > 0 ? (
          programList.map((p) => (
            <div className="erp-table-row" key={p.programId}>
              <span>{p.name}</span>
              <span className="long-text program-title-span">{p.title}</span>
              <span>{p.email}</span>
              <span className={`status-badge status-${p.approved}`}>
                {p.approved}
              </span>
              <span>{p.createdAt}</span>
              {
                hasRole(["SUPER", "CS"]) &&
                <button
                  className="manage-btn"
                  onClick={() => openModal(p.programId)}
                >
                  관리
                </button>
              }
            </div>
          ))
        ) : (
          <div className="empty-list">조회된 프로그램 리스트가 없습니다.</div>
        )}
      </div>
    </div>
  );
}

export default ProgramApprovalList;
