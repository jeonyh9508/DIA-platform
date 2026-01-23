import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Header.css";
import SearchClose from "./Search/SearchClose";
import SearchFilter from "./Search/SearchFilter";
import SearchButton from "./Search/SearchButton";
import TopButton from "./TopButton";
import HeaderMenu from "./Header/HeaderMenu";

// 상단 헤더, 검색창 여닫기
function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false); // 검색창이 열려있는지, 닫혀있는지 저장
  const [isAnimating, setIsAnimating] = useState(false); // 검색창이 닫히는중인지 표시하는 변수

  const searchRef = useRef(null); // DOM요소(검색 div)를 직접 가리킴
  const navigate = useNavigate();

  // 검색어 및 필터 상태
  const [keyword, setKeyword] = useState("");
  const [filters, setFilters] = useState({
    region: "",
    category: "",
    capacity: "",
    difficultyList: [], // 난이도 필터는 중복 가능이므로 배열로 관리
    durationMin: "",
    minPrice: "",
    maxPrice: "",
  });

  // 외부 클릭 시 상세 검색창 닫기
  useEffect(() => {
    // useEffect : 이 컴포넌트가 화면에 나타나면 실행
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        // 클릭한 곳이 검색창 안인지 확인
        if (isSearchOpen) handleClose(); // 검색창이 열려있으면 닫음
      }
    }
    document.addEventListener("mousedown", handleClickOutside); // 화면을 누르면(mousedown) 핸들러 실행
    return () => document.removeEventListener("mousedown", handleClickOutside); // clean up(정리)
  }, [isSearchOpen]); // isSearch가 바뀔 때마다 이 이펙트가 다시 등록됨 -> 값이 항상 최신으로 유지됨

  // 상세 검색창 닫기 애니메이션
  const handleClose = () => {
    setIsAnimating(true); // 닫히는 애니메이션 시작
    setTimeout(() => {
      setIsAnimating(false); // 애니메이션 끝
      setIsSearchOpen(false); // 실제로 닫힘
    }, 250); // 0.25초 후 닫힘
  };

  // 검색창 여닫이 토글
  const handleToggleSearch = () => setIsSearchOpen(!isSearchOpen);

  // 검색 실행
  const handleSearch = () => {
    // URLSearchParams : 검색 조건을 URL에 붙이기 위해 사용
    const params = new URLSearchParams();
    // 검색어가 있으면 키워드 URL에 추가
    if (keyword) params.append("keyword", keyword);
    // filters 객체에 값이 있으면 전부 URL 추가
    Object.entries(filters).forEach(([key, value]) => {
      if (value === "difficultyList") {
        params.delete("difficultyList"); // 이전 URL 중복 방지위해 삭제
        params.set("difficultyList", value);
      } else if (value) {
        params.set(key, value);
      }
    });
    // URL로 이동
    navigate(
      `/customer/search${params.toString() ? `?${params.toString()}` : ""}`,
    );
  };
  // 로고 클릭 시 최상단으로 이동
  const topClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="home-container">
      <header className="main-header">
        <div className="header-container">
          <div className="header-left">
            <Link to="/" className="header-title" onClick={topClick}>
              <img
                src="http://localhost:9090/upload/logo/dia_logo.png"
                alt="로고"
              />
            </Link>

            {/* 기본 검색창 */}
            <div className="search-bar-container">
              <input
                type="text"
                placeholder="어떤 클래스를 찾으시나요?"
                className="search-input"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                onClick={handleToggleSearch}
              />
              {!isSearchOpen && (
                <button className="search-button" onClick={handleToggleSearch}>
                  <i className="fi fi-rr-search"></i>
                </button>
              )}
            </div>
          </div>

          {/* 상단 우측 메뉴 */}
          <HeaderMenu />
        </div>

        {isSearchOpen && (
          <div
            ref={searchRef}
            className={`search-detail ${isAnimating ? "close" : "open"}`}
          >
            <div className="overlay" onClick={handleClose}></div>
            <div className="search-detail-container">
              {/* 검색 필터 */}
              <SearchFilter
                filters={filters}
                setFilters={setFilters}
                keyword={keyword}
              />
              {/* 검색 및 초기화 버튼 */}
              <SearchButton
                filters={filters}
                setFilters={setFilters}
                keyword={keyword}
                setKeyword={setKeyword}
              />

              <div>
                <SearchClose
                  onClose={handleClose}
                  filters={filters}
                  setFilters={setFilters}
                />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 최상단으로 이동 */}
      <TopButton />
    </div>
  );
}

export default Header;
