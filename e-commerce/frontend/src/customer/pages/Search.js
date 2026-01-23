import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/Search.css";
import SearchFilter from "../components/Search/SearchFilter";
import SearchButton from "../components/Search/SearchButton";
import Footer from "../components/Footer";
import SearchPageInput from "../components/Search/SearchPageInput";
import TopButton from "../components/TopButton";
import { useAuth } from "../../App";
import SearchResult from "../components/Search/SearchResult";
import SearchHeader from "../components/Search/SearchHeader";

function Search({ userId }) {
  const { user, logout } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // 상태
  const [keyword, setKeyword] = useState("");
  const [filters, setFilters] = useState({
    region: "",
    category: "",
    capacity: "",
    difficultyList: [],
    durationMin: "",
    minPrice: "",
    maxPrice: "",
  });
  const [sortOption, setSortOption] = useState("latest");
  const [programs, setPrograms] = useState([]);

  // URL에서 상태 복원
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const keywordParam = params.get("keyword") || "";
    const rawDifficulty = params.get("difficultyList");
    const difficulties = rawDifficulty
      ? rawDifficulty.split(",").map((d) => d.trim())
      : [];

    setKeyword(keywordParam);
    setFilters({
      region: params.get("region") || "",
      category: params.get("category") || "",
      capacity: params.get("capacity") || "",
      difficultyList: difficulties,
      durationMin: params.get("durationMin") || "",
      minPrice: params.get("minPrice") || "",
      maxPrice: params.get("maxPrice") || "",
    });

    const sortParam = params.get("sortOption") || "latest";
    setSortOption(sortParam);
  }, [location.search]);

  return (
    <div className="home-container">
      {/* Search페이지용 헤더(검색창 없는 헤더 버전) */}
      <SearchHeader />
      {/* 상단으로 이동하는 버튼 */}
      <TopButton />

      <main className="main-content">
        <div ref={searchRef} className="search-detail">
          <div className="search-bar-detail-container">
            {/* 검색창 */}
            <SearchPageInput
              keyword={keyword}
              setKeyword={setKeyword}
              filters={filters}
              sortOption={sortOption}
              navigate={navigate}
            />
            {/* 검색 필터 6가지 */}
            <SearchFilter filters={filters} setFilters={setFilters} />
            {/* 초기화, 검색하기 버튼 */}
            <SearchButton
              filters={filters}
              setFilters={setFilters}
              keyword={keyword}
              setKeyword={setKeyword}
            />
          </div>
        </div>
        {/* 필터 검색 조회 결과, 더보기 버튼 */}
        <SearchResult
          userId={userId}
          programs={programs}
          setPrograms={setPrograms}
          sortOption={sortOption}
          setSortOption={setSortOption}
          location={location}
          navigate={navigate}
        />
      </main>

      <Footer />
    </div>
  );
}

export default Search;
