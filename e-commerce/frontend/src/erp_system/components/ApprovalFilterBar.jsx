import React from "react";

function ApprovalFilterBar({
  setFilter,
  keywordInput,
  setKeywordInput,
  onSearch,
}) {
  return (
    <div className="approval-filter-bar">
      <select
        className="filter-select"
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="ALL">전체</option>
        <option value="승인">승인</option>
        <option value="대기">대기</option>
        <option value="거절">거절</option>
      </select>

      <input
        type="text"
        placeholder="공방/프로그램명 검색"
        className="filter-input"
        value={keywordInput}
        onChange={(e) => setKeywordInput(e.target.value)}
      />

      <button className="search-btn" onClick={onSearch}>
        검색
      </button>
    </div>
  );
}

export default ApprovalFilterBar;
