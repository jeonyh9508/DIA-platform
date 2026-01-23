import React from "react";
import { Link } from "react-router-dom";
function MyReviewProgramInfo({ myReview }) {
  return (
    <div className="review-program-info">
      {myReview.thumb ? (
        <Link to={`/customer/program/${myReview.programId}`} className="link">
          <img
            src={`http://localhost:9090/upload/workshop/${myReview.workshopId}/program/${myReview.programId}/${myReview.thumb}`}
            alt={myReview.title}
            className="review-program-thumb"
          />
        </Link>
      ) : (
        <p className="review-program-thumb">이미지 없음</p>
      )}
      <div className="review-program-texts">
        <Link to={`/customer/program/${myReview.programId}`} className="link">
          <div className="review-program-title">{myReview.title}</div>
        </Link>
        <Link to={`/customer/workshop/${myReview.workshopId}`} className="link">
          <div className="review-program-workshop">{myReview.workshopName}</div>
        </Link>
      </div>
    </div>
  );
}
export default MyReviewProgramInfo;
