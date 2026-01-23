import React from "react";

function LoadMore({ visibleCount, items = [], handleLoadMore }) {
  // workshops, programs, wishes냐에 따라서 달라짐
  const totalLength = items.length;
  if (visibleCount >= totalLength) return null;
  return (
    <div className="load-more">
      <button onClick={handleLoadMore}>더보기</button>
    </div>
  );
}
export default LoadMore;
