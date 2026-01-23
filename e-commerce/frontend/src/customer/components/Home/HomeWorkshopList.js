import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SliderButton from "./SliderButton";
import axios from "axios";
import "../../css/HomeSlideSection.css";
import { useAuth } from "../../../App";
import { toast } from "react-toastify";

function WorkshopList({ workshops }) {
  const { user } = useAuth();
  const userId = user?.userId;
  // 좌우 버튼 스크롤
  const scrollRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  // 스크롤 이동 함수
  const handleScroll = (direction) => {
    if (isScrolling || !scrollRef.current) return;
    setIsScrolling(true);
    const el = scrollRef.current;
    const cardWidth = el.children[0].offsetWidth + 16;
    const scrollDistance =
      direction === "right" ? cardWidth * 1 : -cardWidth * 1;
    el.scrollBy({ left: scrollDistance, behavior: "smooth" });
    setTimeout(() => setIsScrolling(false), 400);
  };
  const handleScrollLeft = () => handleScroll("left");
  const handleScrollRight = () => handleScroll("right");

  // 버튼 상태 제어
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // 스크롤 이동 후 버튼 활성/비활성 갱신
  const updateScrollState = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const maxScrollLeft = el.scrollWidth - el.clientWidth;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < maxScrollLeft - 5); // 오차 방지
  };

  // 스크롤 할 때 마다 감시
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState);
    return () => el.removeEventListener("scroll", updateScrollState);
  }, []);

  useEffect(() => {
    updateScrollState();
  }, [workshops]);

  // 팔로우 기능
  const [followStates, setFollowStates] = useState({});
  const handleFollowToggle = async (e, workshopId) => {
    e.preventDefault(); // link 이동 방지
    e.stopPropagation(); // 부모 이벤트 전파 차단
    if (!userId) {
      toast.error("로그인이 필요합니다.");
    }
    try {
      await axios.post(
        `http://localhost:9090/customer/follow/workshop-follow?userId=${userId}`,
        {
          userId: userId,
          workshopId: workshopId,
        }
      );

      setFollowStates((prev) => ({
        ...prev,
        [workshopId]: !prev[workshopId],
      }));
      if (!followStates[workshopId]) {
        toast("🙋‍♀️ 공방을 팔로우했습니다.");
      } else {
        toast("✋ 공방 팔로우를 취소했습니다.");
      }
    } catch (err) {
      console.error("팔로우 토글 실패:", err);
      console.log("팔로우 요청 데이터:", { userId, workshopId });
    }
  };
  useEffect(() => {
    const fetchFollows = async () => {
      try {
        const res = await axios.get(
          `http://localhost:9090/customer/follow/list?userId=${userId}`
        );

        // 예: res.data = [1, 3, 5]  (팔로우 중인 workshopId 목록)
        const initialStates = {};
        res.data.forEach((id) => {
          initialStates[id] = true;
        });
        setFollowStates(initialStates);
      } catch (err) {
        console.error("팔로우 목록 불러오기 실패:", err);
      }
    };

    if (userId) fetchFollows();
  }, [userId]);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:9090/customer/follow/tag")
      .then((res) => {
        // console.log("태그 응답:", res.data);
        // { workshopId: 1, categories: "도자기,핸드메이드" } → 형태를 map으로 변환

        const tagMap = {};
        res.data.forEach((item) => {
          tagMap[item.workshopId] = item.categories
            ? item.categories.split(",")
            : [];
        });
        setCategories(tagMap);
      })
      .catch((err) => console.error("홈 데이터 불러오기 오류:", err));
  }, []);

  return (
    <section className="workshop-recommend-section">
      <div className="section-header">
        <div className="header-left">
          <h3>추천 공방 🏠</h3>
          <Link to="/customer/workshopall" className="more-link">
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

      <div className="workshop-scroll-container">
        <div className="workshop-slide-list" ref={scrollRef}>
          {workshops.slice(0, 1).length > 0 ? (
            workshops.slice(0, 12).map((workshop) => (
              <Link
                to={`/customer/workshop/${workshop.workshopId}`}
                className="link"
                key={workshop.workshopId}
              >
                <div className="workshop-slide-card">
                  <div className="workshop-slide-logo">
                    {workshop.profileImg != null ? (
                      <img
                        src={`http://localhost:9090/upload/workshop/${workshop.workshopId}/${workshop.profileImg}`}
                        alt="워크샵 이미지"
                      />
                    ) : (
                      <p>이미지 없음</p>
                    )}
                  </div>

                  <div className="workshop-slide-info">
                    <p className="workshop-slide-name">{workshop.name}</p>

                    <button
                      className={`follow-slide-btn ${
                        followStates[workshop.workshopId] ? "following" : ""
                      }`}
                      onClick={(e) =>
                        handleFollowToggle(e, workshop.workshopId)
                      }
                    >
                      {followStates[workshop.workshopId]
                        ? "팔로잉"
                        : "+ 팔로우"}
                    </button>
                    <span className="workshop-card-location">
                      📍{workshop.address}
                    </span>
                    <div className="workshop-slide-tags">
                      {categories[workshop.workshopId]?.length ? (
                        categories[workshop.workshopId].map((tag, idx) => (
                          <span key={idx} className="workshop-slide-tag">
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="workshop-slide-tag">태그 없음</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p>공방 정보가 없습니다.</p>
          )}
        </div>
      </div>
    </section>
  );
}
export default WorkshopList;
