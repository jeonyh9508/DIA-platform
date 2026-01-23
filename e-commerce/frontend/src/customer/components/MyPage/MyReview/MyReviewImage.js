import React from "react";

function MyReviewImage({ myReview }) {
  console.log(myReview.programId);
  return (
    <div className="review-image">
      {myReview.reviewImage ? (
        <img
          src={`http://localhost:9090/upload/review/${myReview.programId}/${myReview.reviewImage}`}
          alt="리뷰 이미지"
        />
      ) : (
        <span>리뷰 이미지 없음</span>
      )}
    </div>
  );
}
export default MyReviewImage;
