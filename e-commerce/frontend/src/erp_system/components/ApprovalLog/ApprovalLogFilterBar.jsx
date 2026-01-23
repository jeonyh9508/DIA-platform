import React from "react";

function ApprovalLogFilterBar({
  filterWorkshop,
  setFilterWorkshop,
  filterProgram,
  setFilterProgram,
  setFilter,
  keywordInput,
  setKeywordInput,
  onSearch,
}) {
  return (
    <div className="approval-log-filter-bar">
      <div className="approval-log-filter-set">
        <label className="checkbox">
          <input
            type="checkbox"
            checked={filterWorkshop}
            onChange={(e) => setFilterWorkshop(e.target.checked)}
          />
          공방
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={filterProgram}
            onChange={(e) => setFilterProgram(e.target.checked)}
          />
          프로그램
        </label>
      </div>

      <div className="approval-log-filter-set">
        <select
          className="filter-select"
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="ALL">전체</option>
          <option value="승인">승인</option>

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
    </div>
  );
}

export default ApprovalLogFilterBar;
