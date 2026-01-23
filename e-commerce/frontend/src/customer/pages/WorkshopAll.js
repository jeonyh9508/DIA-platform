import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import { Link } from "react-router-dom";
import "../css/WorkshopAll.css";
import Footer from "../components/Footer";
import LoadMore from "../components/LoadMore";
import WorkshopSlideInfo from "../components/WorkshopAll/WorkshopSlideInfo";
import WorkshopAllSlideLogo from "../components/WorkshopAll/WorkshopAllSlideLogo";

function WorkshopAll({ userId }) {
  const [workshops, setWorkshops] = useState([]);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:9090/customer/home")
      .then((res) => {
        setWorkshops(res.data.workshops);
      })
      .catch((err) => console.error("홈 데이터 불러오기 오류:", err));
  }, []);

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

  // 더보기 클릭함수 추가
  const [visibleCount, setVisibleCount] = useState(12);
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

  return (
    <div>
      <Header />
      <div className="main-content">
        <h2 className="page-title">🏠 공방 모아보기</h2>
        {<p className="content-count">{workshops.length}개의 공방</p>}
        <div className="workshop-all">
          {workshops.length > 0 ? (
            workshops.slice(0, visibleCount).map((workshop) => (
              <Link
                to={`/customer/workshop/${workshop.workshopId}`}
                className="link"
                key={workshop.workshopId}
              >
                <div className="workshop-slide-card">
                  {/* 공방 이미지 */}
                  <WorkshopAllSlideLogo workshop={workshop} />
                  {/* 공방 정보(공방명, 팔로우버튼, 태그) */}
                  <WorkshopSlideInfo
                    userId={userId}
                    workshop={workshop}
                    categories={categories}
                  />
                </div>
              </Link>
            ))
          ) : (
            <p>공방 정보가 없습니다.</p>
          )}
        </div>
        {/* 더보기 버튼 */}
        <LoadMore
          visibleCount={visibleCount}
          items={workshops}
          handleLoadMore={handleLoadMore}
        />
      </div>
      <Footer />
    </div>
  );
}
export default WorkshopAll;
