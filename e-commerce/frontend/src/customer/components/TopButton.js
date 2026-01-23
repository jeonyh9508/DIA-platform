import React from "react";

function TopButton() {
  // top 버튼 클릭
  const topClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <button className="topBtn" onClick={topClick}>
      TOP
    </button>
  );
}
export default TopButton;
