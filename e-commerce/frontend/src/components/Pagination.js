import React from "react";
import "./Pagination.css";

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const groupSize = 5; // 페이지 버튼 그룹 사이즈
  const groupStart = Math.floor((currentPage - 1) / groupSize) * groupSize + 1;
  const groupEnd = Math.min(groupStart + groupSize - 1, totalPages);

  const pages = [];
  for (let p = groupStart; p <= groupEnd; p++) {
    pages.push(
      <button
        key={p}
        className={currentPage === p ? "active" : ""}
        onClick={() => onPageChange(p)}
      >
        {p}
      </button>
    );
  }

  return (
    <div className="pagination">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ◀
      </button>

      {pages}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        ▶
      </button>
    </div>
  );
}

export default Pagination;
