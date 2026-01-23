import React from "react";
import "../../css/Header.css";
import { useNavigate } from "react-router-dom";

function SearchButton({ filters, setFilters, keyword, setKeyword }) {
  const navigate = useNavigate();

  // 검색 실행
  const handleSearch = () => {
    const params = new URLSearchParams();

    // 키워드 추가
    if (keyword) params.append("keyword", keyword);
    // filters 객체에 값이 있으면 전부 URL 파라미터에 추가
    Object.entries(filters).forEach(([key, value]) => {
      // 객체를 배열로 변경
      if (key === "difficultyList") {
        params.append("difficultyList", value);
      } else if (value) {
        params.append(key, value);
      }
    });

    // URL로 이동
    navigate(
      `/customer/search${params.toString() ? `?${params.toString()}` : ""}`
    );
  };

  // 필터 초기화
  const resetDetailSearch = () => {
    setKeyword("");
    setFilters({
      region: "",
      category: "",
      capacity: "",
      difficultyList: [],
      durationMin: "",
      minPrice: "",
      maxPrice: "",
    });
  };
  return (
    <div className="search-button-field">
      <input
        type="button"
        className="reset-button"
        onClick={resetDetailSearch}
        value="
        ↻ 초기화"
      />
      <input
        type="button"
        className="apply-button"
        onClick={handleSearch}
        value="검색하기"
      />
    </div>
  );
}
export default SearchButton;
