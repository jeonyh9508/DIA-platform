import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "../css/Home.css";
import Footer from "../components/Footer";
import HomeSlideSection from "../components/Home/HomeSlideSection";
import CategoryNav from "../components/Home/CategoryNav";
import HomeBanner from "../components/Home/HomeBanner";

function Home({ userId }) {
  const [workshops, setWorkshops] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [categories, setCategory] = useState([]);
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All 전체");
  const hasLogged = useRef(false);

  useEffect(() => {
    if (hasLogged.current) {
      return;
    }

    hasLogged.current = true;

    axios
      .post("http://localhost:9090/erp-system/visit-log", {
        workshopId: null,
        programId: null,
      })
      .then(() => {
        console.log("방문 로그 전송 성공");
      })
      .catch((err) => {
        console.error("방문로그 저장 실패:", err);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:9090/customer/home")
      .then((res) => {
        setWorkshops(res.data.workshops);
        setPrograms(res.data.programs);
        setCategory(res.data.categories);
      })
      .catch((err) => console.error("홈 데이터 불러오기 오류:", err));
  }, []);

  function categoryLink(categoryName) {
    navigate(`/customer/search?category=${encodeURIComponent(categoryName)}`);
  }
  // 카테고리별 아이콘 매핑
  const categoryIcons = {
    도자기: "🍶",
    액세서리: "💍",
    캔들: "🕯️",
    드로잉: "🎨",
    페인팅: "🖌️",
    공예: "🧵",
    디자인: "📐",
    홈데코: "🏠",
    비누: "🧼",
    목공: "🪑",
    베이킹: "🍰",
    가죽: "👜",
    서예: "🖋️",
    민화: "🖼️",
    플라워: "💐",
  };

  // 좌우 버튼 스크롤
  const scrollRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 한 칸 오른쪽
  const handleScrollRight = () => {
    if (isScrolling || !scrollRef.current) return;
    setIsScrolling(true);
    const el = scrollRef.current;
    const cardWidth = el.children[0].offsetWidth;
    const nextIndex =
      currentIndex + 1 < categories.length ? currentIndex + 1 : 0;
    el.scrollTo({
      left: cardWidth * nextIndex,
      behavior: "smooth",
    });
    setCurrentIndex(nextIndex);
    setTimeout(() => setIsScrolling(false), 400);
  };

  // 한 칸 왼쪽
  const handleScrollLeft = () => {
    if (isScrolling || !scrollRef.current) return;
    setIsScrolling(true);
    const el = scrollRef.current;
    const cardWidth = el.children[0].offsetWidth;
    const prevIndex =
      currentIndex - 1 >= 0 ? currentIndex - 1 : categories.length - 1;
    el.scrollTo({
      left: cardWidth * prevIndex,
      behavior: "smooth",
    });
    setCurrentIndex(prevIndex);
    setTimeout(() => setIsScrolling(false), 400);
  };

  return (
    <div className="home-container">
      <Header />
      <main className="main-content">
        {/* 메인 배너 */}
        <HomeBanner
          scrollRef={scrollRef}
          handleScrollLeft={handleScrollLeft}
          handleScrollRight={handleScrollRight}
          setCurrentIndex={setCurrentIndex}
          currentIndex={currentIndex}
        />
        {/* 카테고리 네비게이션 */}
        <CategoryNav
          navigate={navigate}
          setSelectedCategory={setSelectedCategory}
          selectedCategory={selectedCategory}
          categories={categories}
          categoryLink={categoryLink}
          categoryIcons={categoryIcons}
        />
        {/* 프로그램, 공방 슬라이드 */}
        <HomeSlideSection workshops={workshops} user={userId} />
      </main>
      <Footer />
    </div>
  );
}
export default Home;
