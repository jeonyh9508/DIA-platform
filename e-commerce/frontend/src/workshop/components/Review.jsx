import axios from "axios";
import React, { useEffect, useState } from "react";
import "../css/Review.css";

function Review({ workshopId, programId }) {
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    if (!workshopId && !programId) return;

    const dto = {
      workshopId: programId ? null : workshopId,
      programId: programId ?? null,
    };

    axios
      .get("http://localhost:9090/workshop/review", { params: dto })
      .then((res) => setReviews(res.data))
      .catch((err) => console.log(err));
  }, [workshopId, programId]);

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "-";

  return (
    <div className="ws-review-container">
      <h3 className="ws-review-title">
        리뷰 목록 ({reviews.length}개 / 평점 : {averageRating})
      </h3>
      {reviews.length > 0 ? (
        <ul className="ws-review-list">
          {reviews.map((r) => (
            <li key={r.reviewId} className="ws-review-item ws-inner-card">
              <div className="ws-review-header">
                <span className="ws-reviewer-name">
                  <strong>{r.name}</strong>
                </span>
                <span className="ws-review-rating">
                  별점 :{" "}
                  <span>
                    <span>
                      <span style={{ color: "#ffb400" }}>
                        {console.log(r.rating)}
                        {"★".repeat(r.rating !== 0 ? r.rating : 1)}
                        {"☆".repeat(r.rating ? 5 - r.rating : 1)}
                      </span>{" "}
                      <span>{r.rating ? r.rating.toFixed(1) : "0.0"} | </span>
                    </span>
                  </span>
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="ws-review-content">{r.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="ws-review-empty">리뷰가 없습니다.</p>
      )}
    </div>
  );
}

export default Review;
