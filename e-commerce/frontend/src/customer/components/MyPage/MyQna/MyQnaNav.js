import React from "react";

function MyQnaNav({ filter, setFilter }) {
  return (
    <nav className="qna-nav">
      {" "}
      {/* NAV 필터 */}
      <span
        className={`navi-item ${filter === "전체" ? "active" : ""}`}
        onClick={() => setFilter("전체")}
      >
        전체
      </span>
      <span
        className={`navi-item ${filter === "공방" ? "active" : ""}`}
        onClick={() => setFilter("공방")}
      >
        공방
      </span>
      <span
        className={`navi-item ${filter === "관리자" ? "active" : ""}`}
        onClick={() => setFilter("관리자")}
      >
        관리자
      </span>
    </nav>
  );
}
export default MyQnaNav;
