import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoadMore from "../LoadMore";

function ProgramCard({ programs, workshop, clickWishBtn, countWish }) {
  const [visibleCount, setVisibleCount] = useState(9);

  const handleLoadMore = () => setVisibleCount((prev) => prev + 9);

  return (
    <section className="program-list-section">
      <div className="section-header">
        <div className="program-list-title">프로그램 목록</div>
      </div>
      <div className="program-list">
        {programs.length > 0 ? (
          programs.slice(0, visibleCount).map((program, index) => (
            // ProgramCard
            <div key={program.programId} className="program-card">
              <Link
                to={`/customer/program/${program.programId}`}
                className="link"
              >
                <div className="card-image-container">
                  <div className="card-image-placeholder">
                    <div
                      className={`card-image-placeholder ${
                        program.thumb == null ? "no-image" : ""
                      }`}
                    >
                      {program.thumb != null ? (
                        <img
                          src={`http://localhost:9090/upload/workshop/${workshop.workshopId}/program/${program.programId}/${program.thumb}`}
                          alt="프로그램 썸네일"
                        />
                      ) : (
                        <p>이미지 없음</p>
                      )}
                    </div>
                  </div>
                  <span className="card-category-badge">
                    {program.category}
                  </span>
                  <button
                    className={`wish-icon ${program.wished ? "on" : "off"}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      clickWishBtn(program.programId, index);
                    }}
                  >
                    {program.wished ? "❤️" : "🤍"}
                  </button>
                </div>
                <div className="card-info">
                  <div className="workshop-program-title">
                    <div className="workshop-profile-thumb">
                      {workshop.profileImg ? (
                        <img
                          src={`http://localhost:9090/upload/workshop/${workshop.workshopId}/${workshop.profileImg}`}
                          alt="워크샵 이미지"
                          className="workshop-profile-thumb"
                        />
                      ) : (
                        <p>'x'</p>
                      )}
                    </div>
                    <p className="card-workshop-name">{workshop.name}</p>
                  </div>
                  <h4 className="card-title">{program.title}</h4>
                  <div className="card-stats">
                    <span className="card-rating">
                      ⭐{" "}
                      {program.avgRating ? program.avgRating.toFixed(1) : "0.0"}{" "}
                      ({program.countReview || 0})
                    </span>
                    <span className="card-likes">
                      ❤️ {countWish[index] || 0}
                    </span>
                  </div>
                  <p className="card-location">📍 {workshop.address}</p>
                  <p className="card-price">
                    {program.price.toLocaleString()}원
                  </p>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p>개설된 프로그램이 없습니다.</p>
        )}
      </div>

      <LoadMore
        visibleCount={visibleCount}
        items={programs}
        handleLoadMore={handleLoadMore}
      />
    </section>
  );
}

export default ProgramCard;
