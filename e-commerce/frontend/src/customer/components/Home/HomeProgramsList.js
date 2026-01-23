import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SliderButton from "./SliderButton";
import axios from "axios";
import { useAuth } from "../../../App";
import { toast } from "react-toastify";

function HomeProgramsList({
  title,
  region,
  sortOption,
  category,
  capacity,
  difficultyList,
  durationMin,
}) {
  const { user } = useAuth();
  const userId = user?.userId;
  // 스크롤 관련
  const scrollRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false); // 스무스 스크롤 중인지
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true); // 좌, 우 활성화 여부
  const [programs, setPrograms] = useState([]); // 화면에 표시할 프로그램 목록
  const [wishList, setWishList] = useState([]); // 내 위시 프로그램 id 목록
  const [wishLoaded, setWishLoaded] = useState(false); // 위시 목록을 이미 불러왔는지 여부

  // 안전한 handleScroll
  const handleScroll = (direction) => {
    const el = scrollRef.current;
    if (!el || isScrolling) return;
    const firstCard = el.querySelector(".program-card");
    if (!firstCard) return;
    const styles = getComputedStyle(el);
    const gap = parseFloat(styles.columnGap || styles.gap || "25") || 25;
    const cardWidth = firstCard.getBoundingClientRect().width;
    const distance =
      direction === "right" ? cardWidth + gap : -(cardWidth + gap);
    setIsScrolling(true);
    el.scrollBy({ left: distance, behavior: "smooth" });
    setTimeout(() => {
      setIsScrolling(false);
      updateScrollState();
    }, 400);
  };

  const handleScrollLeft = () => {
    // console.log("LEFT~~");
    handleScroll("left");
  };

  const handleScrollRight = () => {
    // console.log("RIGHT~~");
    handleScroll("right");
  };

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < maxScrollLeft - 5);
  };

  // programs 로드 후 상태 갱신
  useEffect(() => {
    updateScrollState();
  }, [programs]);

  // 프로그램 목록 + 위시 목록
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
      .catch((err) => console.error("위시리스트 불러오기 오류:", err));
    setWishLoaded(true);
  }, [userId]);

  // 프로그램 목록 불러오기
  useEffect(() => {
    if (userId && !wishLoaded) {
      return; // 로그인했는데, 아직 하트(wish) 정보 로딩 안 됐으면 대기
    }
    // 비로그인 대비
    const fetchPrograms = async () => {
      try {
        const params = new URLSearchParams();
        if (sortOption) params.set("sortOption", sortOption);
        if (region) params.set("region", region);
        if (category) params.set("category", category);
        if (capacity) params.set("capacity", capacity);
        if (difficultyList) params.set("difficultyList", difficultyList);
        if (durationMin) params.set("durationMin", durationMin);

        const res = await fetch(
          `http://localhost:9090/customer/search${
            params.toString() ? `?${params.toString()}` : ""
          }`
        );
        if (!res.ok) throw new Error("서버 오류");
        const data = await res.json();

        const merged = data.map((p) => ({
          ...p,
          isWished: wishList.includes(p.programId),
          wishCount: p.countWish ?? 0,
        }));
        setPrograms(merged || []);
      } catch (err) {
        console.error("프로그램 목록 불러오기 실패:", err);
      }
    };
    fetchPrograms();
  }, [
    sortOption,
    region,
    category,
    capacity,
    difficultyList,
    durationMin,
    wishList,
    wishLoaded,
    userId,
  ]);

  // 위시 토글
  const toggleWish = (programId) => {
    if (!userId) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    const clicked = programs.find((p) => p.programId === programId);
    if (!clicked) return;

    // 클릭 전 상태 기준으로 action 계산
    const action = clicked.isWished ? "remove" : "add";

    // optimistic UI 업데이트
    setPrograms((prev) =>
      prev.map((p) =>
        p.programId === programId
          ? {
              ...p,
              isWished: !p.isWished,

              countWish: Math.max(
                (p.countWish ?? 0) + (action === "add" ? 1 : -1),
                0
              ),
            }
          : p
      )
    );

    axios
      .post(`http://localhost:9090/customer/toggle-wish`, {
        userId,
        programId: programId,
        action,
      })
      .then((res) => {
        console.log("위시 토글 성공:", res.data);

        if (action === "add") {
          toast("💖 위시리스트에 추가되었습니다.");
        } else {
          toast("🤍 위시리스트에서 삭제되었습니다.");
        }
        if (res.data && res.data.newCountWish !== undefined) {
          setPrograms((prev) =>
            prev.map((p) =>
              p.programId === programId
                ? {
                    ...p,
                    countWish: res.data.newCountWish,
                    isWished: action === "add",
                  }
                : p
            )
          );
        }
      })
      .catch((err) => {
        console.error("위시리스트 토글 오류:", err);
        toast("위시리스트 변경에 실패했습니다. 다시 시도해주세요.");

        // 실패 시 롤백
        setPrograms((prev) =>
          prev.map((p) =>
            p.programId === programId
              ? {
                  ...p,
                  isWished: !p.isWished,

                  countWish: Math.max(
                    (p.countWish ?? 0) + (action === "add" ? -1 : 1),
                    0
                  ),
                }
              : p
          )
        );
      });
  };

  return (
    <section className="program-list-section">
      <div className="section-header">
        <div className="header-left">
          <h3>{title}</h3>
          <Link
            to={
              sortOption
                ? `/customer/search?sortOption=${sortOption}`
                : difficultyList
                ? `/customer/search?difficultyList=${difficultyList}`
                : category
                ? `/customer/search?category=${category}`
                : durationMin
                ? `/customer/search?durationMin=${durationMin}`
                : region
                ? `/customer/search?region=${region}`
                : capacity
                ? `/customer/search?capacity=${capacity}`
                : "/customer/search"
            }
            className="more-link"
          >
            더보기 &gt;
          </Link>
        </div>
        <div className="header-right">
          <SliderButton
            handleScrollLeft={handleScrollLeft}
            handleScrollRight={handleScrollRight}
            canScrollLeft={canScrollLeft}
            canScrollRight={canScrollRight}
          />
        </div>
      </div>

      <div className="scroll-container">
        <div className="program-list-scroll" ref={scrollRef}>
          {programs.length > 0 ? (
            programs.slice(0, 12).map((program) => (
              <div key={program.programId} className="program-card">
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
                          loading="lazy"
                        />
                      ) : (
                        <p>이미지 없음</p>
                      )}
                      <span className="card-category-badge">
                        {program.category}
                      </span>

                      {/* ❤️ 하트 버튼 */}
                      <button
                        className={`wish-icon ${
                          program.isWished ? "on" : "off"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWish(program.programId);
                        }}
                      >
                        {program.isWished ? "❤️" : "🤍"}
                      </button>
                    </div>
                  </div>

                  <div className="card-info">
                    <div className="workshop-program-title">
                      <div className="workshop-profile-thumb">
                        {program.profileImg != null ? (
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
                        ⭐
                        {program.avgRating
                          ? program.avgRating.toFixed(1)
                          : "0.0"}{" "}
                        ({program.reviewCount || 0})
                      </span>
                      <span className="card-likes">
                        ❤️ {program.countWish || 0}
                      </span>
                    </div>
                    <p className="card-location">📍{program.address}</p>
                    <p className="card-price">
                      {program.price.toLocaleString()}원
                    </p>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p>프로그램 정보가 없습니다.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default HomeProgramsList;
