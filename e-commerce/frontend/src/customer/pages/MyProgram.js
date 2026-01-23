import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import "../css/MyProgram.css";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import LoadMore from "../components/LoadMore";

function MyProgram({ userId }) {
  const [programs, setPrograms] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    axios
      .get(`http://localhost:9090/customer/my-program?userId=${userId}`)
      .then((res) => {
        setPrograms(res.data);
      })
      .catch((err) => console.error("프로그램 정보 불러오기 오류:", err));
  }, [userId]);

  const handleLoadMore = () => setVisibleCount((prev) => prev + 5);

  return (
    <div className="my-page">
      <Header />

      <div className="mypage-container">
        <nav className="breadcrumb">
          <span>
            <Link to="http://localhost:3000/customer/mypage" className="link">
              마이페이지
            </Link>{" "}
            &gt; 수강한 프로그램
          </span>
        </nav>

        <h1 className="page-title">수강한 프로그램</h1>

        <div className="my-program">
          <div className="my-program-nav">
            <span>프로그램 정보</span>
            <span>프로그램명</span>
            <span>가격(인원)</span>
            <span>수강일</span>
          </div>

          <div className="my-program-info">
            {programs.length > 0 ? (
              programs.slice(0, visibleCount).map((program) => (
                <div key={program.reservationId} className="my-program-card">
                  <span className="my-program-thumb">
                    <Link
                      to={`/customer/program/${program.programId}`}
                      className="link"
                    >
                      <div
                        className={`my-program-thumb ${
                          program.thumb == null ? "no-image" : ""
                        }`}
                      >
                        {program.thumb != null ? (
                          <img
                            src={`http://localhost:9090/upload/workshop/${program.workshopId}/program/${program.programId}/${program.thumb}`}
                            alt="프로그램 썸네일"
                          />
                        ) : (
                          <p>이미지 없음</p>
                        )}
                      </div>
                    </Link>
                  </span>

                  <span>{program.title}</span>
                  <span>
                    {program.totalPrice.toLocaleString()}원 ({program.numPeople}
                    명)
                  </span>
                  <span>{program.startTime}</span>
                </div>
              ))
            ) : (
              <div className="empty-message">수강한 프로그램이 없습니다.</div>
            )}
            <LoadMore
              visibleCount={visibleCount}
              items={programs}
              handleLoadMore={handleLoadMore}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MyProgram;
