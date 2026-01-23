import React from "react";
function SearchPageInput({
  keyword,
  setKeyword,
  filters,
  sortOption,
  navigate,
}) {
  // 검색 실행 → URL 변경
  const handleSearch = () => {
    const params = new URLSearchParams();

    if (keyword) params.set("keyword", keyword);

    Object.entries(filters).forEach(([key, value]) => {
      if (
        key === "difficultyList" &&
        Array.isArray(value) &&
        value.length > 0
      ) {
        params.append("difficultyList", value.join(","));
      } else if (value) {
        params.append(key, value);
      }
    });

    if (sortOption) params.set("sortOption", sortOption);

    navigate(
      `/customer/search${params.toString() ? `?${params.toString()}` : ""}`
    );
  };
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="어떤 클래스를 찾으시나요?"
        className="search-bar-input"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        // 엔터키 -> 검색 페이지
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
      />
      {/* 돋보기 버튼 클릭 -> 검색 페이지 */}
      <button className="search-button" onClick={handleSearch}>
        <i className="fi fi-rr-search"></i>
      </button>
    </div>
  );
}
export default SearchPageInput;
