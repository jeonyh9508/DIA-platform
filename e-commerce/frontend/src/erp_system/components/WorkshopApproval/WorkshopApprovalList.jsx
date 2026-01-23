import React from "react";
import { useAuth } from "../../../App";
import SortButton from "../SortButton";

function WorkshopApprovalList({
  workshopList,
  sortBy,
  sortDir,
  toggleSort,
  openModal,
}) {
  const { hasRole } = useAuth();

  return (
    <div className="erp-table workshop-table">
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
          공방주명
          <SortButton
            column="u.name"
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
            column="w.created_at"
            sortBy={sortBy}
            sortDir={sortDir}
            toggleSort={toggleSort}
          />
        </span>
        <span>비고</span>
      </div>

      <div className="erp-table-body">
        {workshopList.length > 0 ? (
          workshopList.map((w) => (
            <div className="erp-table-row" key={w.workshopId}>
              <span>{w.name}</span>
              <span>{w.userName}</span>
              <span>{w.email}</span>
              <span className={`status-badge status-${w.approved}`}>
                {w.approved}
              </span>
              <span>{w.createdAt}</span>
              {
                hasRole(["SUPER", "CS"]) &&
                <button
                  className="manage-btn"
                  onClick={() => openModal(w.workshopId)}
                >
                  관리
                </button>
              }
            </div>
          ))
        ) : (
          <div className="empty-list">조회된 공방 리스트가 없습니다.</div>
        )}
      </div>
    </div>
  );
}

export default WorkshopApprovalList;
