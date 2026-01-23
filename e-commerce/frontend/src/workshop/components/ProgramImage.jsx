import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../css/ProgramImage.css";

function ProgramImageSlider({ workshopId, programId }) {
  const [imageList, setImageList] = useState([]);
  const scrollRef = useRef(null);
  const visibleCount = 2;

  useEffect(() => {
    if (programId) {
      axios
        .get(
          `http://localhost:9090/workshop/program/images?programId=${programId}`
        )
        .then((res) => setImageList(res.data))
        .catch((err) => console.error("이미지 목록 로딩 오류:", err));
    }
  }, [programId]);

  if (!imageList || imageList.length === 0) return null;

  const handleScroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector(".ws-pi-image-card").offsetWidth;
    const gap = 10;
    let distance = cardWidth * visibleCount + gap * visibleCount;

    if (direction === "right") {
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: distance, behavior: "smooth" });
      }
    } else {
      if (el.scrollLeft === 0) {
        el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
      } else {
        el.scrollBy({ left: -distance, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="ws-pi-slider-container">
      <button
        className="ws-pi-btn ws-pi-btn-left"
        onClick={() => handleScroll("left")}
      >
        ◀
      </button>

      <div className="ws-pi-scroll-wrapper" ref={scrollRef}>
        {imageList.map((img) => (
          <div className="ws-pi-image-card" key={img.programImageId}>
            <img
              src={`http://localhost:9090/upload/workshop/${workshopId}/program/${programId}/${img.image}`}
              alt="프로그램 이미지"
              className="ws-pi-image"
            />
          </div>
        ))}
      </div>

      <button
        className="ws-pi-btn ws-pi-btn-right"
        onClick={() => handleScroll("right")}
      >
        ▶
      </button>
    </div>
  );
}

export default ProgramImageSlider;
