import React, { useEffect, useRef, useState } from "react";
import SliderButton from "./SliderButton";
import axios from "axios";
import { Link } from "react-router-dom";

function HomeBanner({ scrollRef }) {
  const [banners, setBanners] = useState([]);
  const [carouselItems, setCarouselItems] = useState([]); // 복제된 리스트
  const [currentIndex, setCurrentIndex] = useState(1); // 복제 때문에 1부터 시작
  const transitionRef = useRef(true);

  // 배너 데이터 불러오기
  useEffect(() => {
    axios
      .get("http://localhost:9090/erp-system/banner")
      .then((res) => {
        const activeOnly = res.data
          .filter((b) => b.active)
          .sort((a, b) => a.sortOrder - b.sortOrder);

        setBanners(activeOnly);

        if (activeOnly.length > 0) {
          // 맨 앞에 마지막 배너 복제, 맨 뒤에 첫 배너 복제
          setCarouselItems([
            activeOnly[activeOnly.length - 1],
            ...activeOnly,
            activeOnly[0],
          ]);
        }
      })
      .catch((err) => console.error("배너 불러오기 오류:", err));
  }, []);
  // 최초 렌더링에서는 transition 끄기
  useEffect(() => {
    transitionRef.current = false;
    setCurrentIndex(1);

    // 다음 프레임에서 transition 다시 활성화
    setTimeout(() => {
      transitionRef.current = true;
    }, 50);
  }, []);

  // index 변경될 때 스크롤 이동
  useEffect(() => {
    if (!scrollRef.current) return;

    const el = scrollRef.current;
    const cardWidth = el.children[0]?.offsetWidth;

    el.style.transition = transitionRef.current
      ? "transform 0.4s ease"
      : "none";

    el.style.transform = `translateX(${-cardWidth * currentIndex}px)`;

    // 양끝 도달 시 순간점프 처리
    if (currentIndex === 0) {
      setTimeout(() => {
        transitionRef.current = false;
        setCurrentIndex(banners.length);
      }, 400);
    }

    if (currentIndex === banners.length + 1) {
      setTimeout(() => {
        transitionRef.current = false;
        setCurrentIndex(1);
      }, 400);
    }
  }, [currentIndex, banners]);

  // transition 재활성화
  useEffect(() => {
    if (!transitionRef.current) {
      setTimeout(() => {
        transitionRef.current = true;
      }, 50);
    }
  }, [currentIndex]);

  // 자동 슬라이드
  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 7000);

    return () => clearInterval(interval);
  }, [banners]);

  const handlePrev = () => {
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className="banner-wrapper">
      <section className="banner-section" ref={scrollRef}>
        {carouselItems.map((b, i) => (
          <Link to={b.link} className="banner-placeholder" key={i}>
            <img
              src={`http://localhost:9090${b.image}`}
              alt={b.title}
              className="banner-img"
              loading="lazy"
            />
          </Link>
        ))}
      </section>

      <div className="slider-button">
        <SliderButton
          handleScrollLeft={handlePrev}
          handleScrollRight={handleNext}
          canScrollLeft={true}
          canScrollRight={true}
        />
      </div>
    </div>
  );
}

export default HomeBanner;
