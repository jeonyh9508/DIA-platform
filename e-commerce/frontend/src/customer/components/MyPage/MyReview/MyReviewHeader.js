import React from "react";

function MyReviewHeader({ myReview }) {
  return (
    <div className="review-header">
      <span style={{ color: "#ffb400" }}>
        {console.log(myReview.rating)}
        {"★".repeat(myReview.rating !== 0 ? myReview.rating : 1)}
        {"☆".repeat(myReview.rating ? 5 - myReview.rating : 1)}
      </span>
      <span>{myReview.rating ? myReview.rating.toFixed(1) : "0.0"}</span>
      <span>({myReview.updatedAt || myReview.createdAt})</span>
    </div>
  );
}
export default MyReviewHeader;
