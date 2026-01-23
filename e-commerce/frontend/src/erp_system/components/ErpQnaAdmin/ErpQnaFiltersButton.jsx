import React from "react";

function ErpQnaFiltersButton({ setFilters, handleSearch }) {
  // 필터 초기화 버튼
  const handleReset = () => {
    setFilters({
      role: "",
      status: "",
      keyword: "",
      emailSearch: "",
      search: "",
      startDate: "",
      endDate: "",
    });
  };
  return (
    <div className="filter-button">
      <button onClick={handleReset} className="reset-button">
        ↻ 초기화
      </button>
      <button onClick={handleSearch} className="apply-button">
        검색
      </button>
    </div>
  );
}
export default ErpQnaFiltersButton;
