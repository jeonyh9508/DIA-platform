import axios from "axios";
import React from "react";

function MyReviewButton({ myReview, setMyReviews, handleOpenModifyModal }) {
  const delReview = (myReviews) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) {
      return;
    }

    axios
      .get("http://localhost:9090/customer/review/delete-review", {
        params: { reviewId: myReviews.reviewId },
      })
      .then((res) => {
        if (res.data === 1) {
          alert("리뷰 삭제가 완료되었습니다!");
          setMyReviews((prev) =>
            prev.filter((r) => r.reviewId !== myReviews.reviewId)
          );
        } else {
          alert("리뷰 삭제에 실패했습니다. 다시 시도해주세요.");
        }
      })
      .catch((err) => {
        console.error("리뷰 삭제 실패:", err);
        alert("리뷰 삭제 중 오류가 발생했습니다.");
      });
  };
  return (
    <div>
      <input
        type="button"
        value="삭제"
        className="review-delete-button"
        onClick={() => delReview(myReview)}
      />
      <input
        type="button"
        value="수정"
        className="review-modify-button"
        onClick={() => handleOpenModifyModal(myReview)}
      />
    </div>
  );
}
export default MyReviewButton;
