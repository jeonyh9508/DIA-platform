import React from "react";

function SortButton({ column, sortBy, sortDir, toggleSort }) {
  const sorted = sortBy === column;
  const icon = sorted ? (sortDir === "asc" ? "▲" : "▼") : "☰";

  return (
    <button
      className={`sort-btn ${sorted ? "sort" : ""}`}
      onClick={() => toggleSort(column)}
    >
      {icon}
    </button>
  );
}

export default SortButton;
