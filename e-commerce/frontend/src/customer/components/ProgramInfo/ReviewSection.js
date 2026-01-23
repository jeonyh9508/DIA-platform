import React, { useState, forwardRef, useRef, useEffect } from "react";
import "../../css/ReviewSection.css";
import LoadMore from "../LoadMore";
import Modal from "../Modal";

const ReviewSection = forwardRef(({ reviews, userId, onDelete }, ref) => {
  const [expandedIds, setExpandedIds] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);

  const [overflow, setOverflow] = useState({});
  const contentRefs = useRef({});

  const [isOpen, setIsOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    const newOverflow = {};

    reviews.forEach((r) => {
      const id = String(r.reviewId);
      const el = contentRefs.current[id];

      if (el) {
        newOverflow[id] = el.scrollHeight > el.clientHeight + 2;
      }
    });

    setOverflow(newOverflow);
  }, [reviews, visibleCount]);

  const expandReview = (id) => {
    const strId = String(id);
    setExpandedIds((prev) =>
      prev.includes(strId) ? prev.filter((x) => x !== strId) : [...prev, strId]
    );
  };

  const handleLoadMore = () => setVisibleCount((prev) => prev + 5);

  const showImg = (r) => {
    const imgUrl = `http://localhost:9090/upload/review/${r.programId}/${r.reviewImage}`;
    setSelectedImg(imgUrl);
    setIsOpen(true);
  };

  const onClose = () => setIsOpen(false);

  return (
    <section ref={ref} className="section">
      <div className="info-menu">리뷰</div>

      {reviews.length > 0 ? (
        <ul className="review-list">
          {reviews.slice(0, visibleCount).map((r) => {
            const id = String(r.reviewId);

            return (
              <li key={id} className="card">
                <div className="review-card">
                  <div className="card-header">
                    <span className="review_profileImg__">
                      {r.profileImg ? (
                        <img
                          src={`http://localhost:9090/upload/user/${r.userId}/${r.profileImg}`}
                          alt="유저 프로필"
                        />
                      ) : (
                        <img
                          src={`http://localhost:9090/upload/user/default_img.jpg`}
                          alt="유저 프로필"
                        />
                      )}
                    </span>
                    <span className="user">{r.name || "탈퇴한 사용자"}</span>
                    <span className="time">({r.createdAt})</span>
                    <span className="stars">
                      {"★".repeat(r.rating)}
                      {"☆".repeat(5 - r.rating)}
                    </span>
                  </div>

                  <div className="card-content">
                    <div
                      ref={(el) => (contentRefs.current[id] = el)}
                      className={`expand-content ${
                        expandedIds.includes(id) ? "expanded" : ""
                      }`}
                    >
                      {r.content}
                    </div>
                  </div>

                  <div className="card-footer">
                    {(expandedIds.includes(id) || overflow[id]) && (
                      <button
                        className="btn more"
                        onClick={() => expandReview(id)}
                      >
                        {expandedIds.includes(id) ? "줄이기" : "더보기"}
                      </button>
                    )}

                    {userId === r.userId && (
                      <button
                        className="btn delete"
                        onClick={() => onDelete(r.reviewId)}
                      >
                        삭제
                      </button>
                    )}
                  </div>
                </div>

                {r.reviewImage && (
                  <div className="review-img">
                    <img
                      src={`http://localhost:9090/upload/review/${r.programId}/${r.reviewImage}`}
                      alt="리뷰 이미지"
                      className="review-photo"
                      onClick={() => showImg(r)}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>등록된 리뷰가 없습니다.</p>
      )}

      <LoadMore
        visibleCount={visibleCount}
        items={reviews}
        handleLoadMore={handleLoadMore}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        {selectedImg && (
          <div className="review-img-container">
            <div className="enlarge-review-img">
              <img
                src={selectedImg}
                alt="리뷰 이미지"
                className="enlarge-review-photo"
              />
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
});

export default ReviewSection;
