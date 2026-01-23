import React, { useEffect, useState } from "react";
import SearchSortOption from "./SearchSortOption";
import { Link } from "react-router-dom";
import LoadMore from "../LoadMore";
import axios from "axios";
import { toast } from "react-toastify";

function SearchResult({
  userId,
  programs,
  sortOption,
  setSortOption,
  location,
  navigate,
  setPrograms,
}) {
  const [wishList, setWishList] = useState([]);
  const [visibleCount, setVisibleCount] = useState(9);
  const [wishLoaded, setWishLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 위시 토글
  const toggleWish = (programId) => {
    // 1) 로그인 체크
    if (!userId) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    // 2) 기존 상태 저장 (롤백용)
    const prevPrograms = [...programs];
    const targetProgram = programs.find((p) => p.programId === programId);

    if (!targetProgram) return;

    const nextWished = !targetProgram.isWished;
    const nextCount = Math.max(
      (targetProgram.countWish ?? 0) + (nextWished ? 1 : -1),
      0
    );

    // 3) 낙관적 UI 업데이트
    setPrograms((prev) =>
      prev.map((p) =>
        p.programId === programId
          ? { ...p, isWished: nextWished, countWish: nextCount }
          : p
      )
    );

    // 4) 서버 통신
    axios
      .post(`http://localhost:9090/customer/toggle-wish`, {
        userId,
        programId: programId,
        action: nextWished ? "add" : "remove",
      })
      .then((res) => {
        if (res.data?.newCountWish !== undefined) {
          setPrograms((prev) =>
            prev.map((p) =>
              p.programId === programId
                ? {
                    ...p,
                    countWish: res.data.newCountWish,
                    isWished: nextWished,
                  }
                : p
            )
          );
        }

        toast(
          nextWished
            ? "💖 위시리스트에 추가되었습니다."
            : "🤍 위시리스트에서 삭제되었습니다."
        );
      })
      .catch((err) => {
        console.error("위시 토글 실패:", err);

        // 5) 실패 시 UI 롤백
        setPrograms(prevPrograms);

        alert("위시리스트 변경 실패");
      });
  };

  // 내 위시 목록 불러오기
  useEffect(() => {
    if (!userId) {
      setWishList([]);
      setWishLoaded(true);
      return;
    }

    axios
      .get(`http://localhost:9090/customer/my-wish?userId=${userId}`)
      .then((res) => {
        const ids = res.data.map((w) => w.programId);
        setWishList(ids);
      })
      .catch((err) => console.error("위시리스트 불러오기 오류:", err))
      .finally(() => setWishLoaded(true));
  }, [userId]);

  // 프로그램 목록 + 위시 병합 (단일 fetch)
  useEffect(() => {
    if (!wishLoaded) return;

    const fetchPrograms = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams(location.search);

        const allowed = [
          "keyword",
          "difficultyList",
          "minPrice",
          "maxPrice",
          "sortOption",
          "region",
          "category",
          "capacity",
          "durationMin",
        ];

        const query = new URLSearchParams();

        allowed.forEach((key) => {
          const val = params.get(key);
          if (val) query.append(key, val);
        });

        const url = `http://localhost:9090/customer/search?${query.toString()}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`서버 에러: ${res.status}`);
        const data = await res.json();

        // 위시 병합
        const merged = data.map((p) => ({
          ...p,
          isWished: wishList.includes(p.programId),
          countWish: p.countWish ?? 0,
        }));
        setPrograms(merged);
      } catch (err) {
        setError(err.message || "데이터 불러오기 실패");
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [location.search, wishLoaded, wishList]);

  // 더보기
  const handleLoadMore = () => setVisibleCount((prev) => prev + 9);

  return (
    <div className="result-container">
      <div className="result-header">
        {!loading && programs.length > 0 && (
          <p className="content-count">{programs.length}개의 클래스</p>
        )}
        {loading && <p>불러오는 중...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && programs.length === 0 && <p>검색 결과가 없습니다.</p>}
        {/* 최신순/별점순/가격순/소요시간순 */}
        <SearchSortOption
          sortOption={sortOption}
          setSortOption={setSortOption}
          location={location}
          navigate={navigate}
        />
      </div>

      <div className="program-list">
        {programs.slice(0, visibleCount).map((program, index) => (
          <div key={`${program.programId}-${index}`} className="program-card">
            <Link
              to={`/customer/program/${program.programId}`}
              className="link"
            >
              <div className="card-image-container">
                <div className="card-image-placeholder">
                  {program.thumb ? (
                    <img
                      src={`http://localhost:9090/upload/workshop/${program.workshopId}/program/${program.programId}/${program.thumb}`}
                      alt="프로그램 이미지"
                    />
                  ) : (
                    <p>이미지 없음</p>
                  )}
                </div>
                <span className="card-category-badge">{program.category}</span>
                <button
                  className={`wish-icon ${program.isWished ? "on" : "off"}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWish(program.programId);
                  }}
                >
                  {program.isWished ? "❤️" : "🤍"}
                </button>
              </div>

              <div className="card-info">
                <div className="workshop-program-title">
                  <div className="workshop-profile-thumb">
                    {program.profileImg ? (
                      <img
                        src={`http://localhost:9090/upload/workshop/${program.workshopId}/${program.profileImg}`}
                        alt="워크샵 이미지"
                        className="workshop-profile-thumb"
                      />
                    ) : (
                      <p>'x'</p>
                    )}
                  </div>
                  <p className="card-workshop-name">{program.name}</p>
                </div>
                <h4 className="card-title">{program.title}</h4>
                <div className="card-stats">
                  <span className="card-rating">
                    ⭐{" "}
                    {program.avgRating ? program.avgRating.toFixed(1) : "0.0"} (
                    {program.reviewCount || 0})
                  </span>
                  <span className="card-likes">❤️ {program.countWish}</span>
                </div>
                <p className="card-location">📍 {program.address}</p>
                <p className="card-price">{program.price.toLocaleString()}원</p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <LoadMore
        visibleCount={visibleCount}
        items={programs}
        handleLoadMore={handleLoadMore}
      />
    </div>
  );
}
export default SearchResult;
