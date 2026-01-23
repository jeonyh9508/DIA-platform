import React from "react";
import { Link } from "react-router-dom";
import MyReviewButton from "./MyReviewButton";
import MyReviewImage from "./MyReviewImage";
import MyReviewProgramInfo from "./MyReviewProgramInfo";
import MyReviewHeader from "./MyReviewHeader";

function MyReviewLists({ myReview, setMyReviews, handleOpenModifyModal }) {
  return (
    <div className="review-box" key={myReview.reviewId}>
      <div className="review-left">
        {/* 프로그램 정보 */}
        <MyReviewProgramInfo myReview={myReview} />
        {/* 별점, 작성일(수정일) */}
        <MyReviewHeader myReview={myReview} />

        <div className="review-content">{myReview.content}</div>
      </div>
      <div className="review-right">
        {/* 리뷰 이미지 */}
        <MyReviewImage myReview={myReview} />

        {/* 수정, 삭제 버튼 */}
        <MyReviewButton
          myReview={myReview}
          setMyReviews={setMyReviews}
          handleOpenModifyModal={handleOpenModifyModal}
        />
      </div>
    </div>
  );
}
export default MyReviewLists;
