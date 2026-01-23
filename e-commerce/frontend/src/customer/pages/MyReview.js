import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import Footer from "../components/Footer";
import "../css/MyReview.css";
import { Link } from "react-router-dom";
import ModifyReviewModal from "../components/MyPage/MyReview/ModifyReviewModal";
import MyReviewLists from "../components/MyPage/MyReview/MyReviewLists";

function MyReview({ userId }) {
  const [myReviews, setMyReviews] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:9090/customer/my-review?userId=${userId}`)
      .then((res) => setMyReviews(res.data))
      .catch((err) => console.error("프로그램 정보 불러오기 오류:", err));
  }, [userId]);

  // 수정 모달
  const [selectedReview, setSelectedReview] = useState(null);
  const [openModifyModal, setOpenModifyModal] = useState(false);

  // 수정 모달 열기 로직 추가
  const handleOpenModifyModal = (myReviews) => {
    console.log("수정 모달 열기:", myReviews);
    setSelectedReview(myReviews);
    setOpenModifyModal(true);
  };

  // 수정 완료 후 리스트 업데이트
  const handleUpdateSuccess = (updateItem) => {
    setMyReviews((prev) =>
      prev.map((review) =>
        review.reviewId === updateItem.reviewId ? updateItem : review
      )
    );
    setOpenModifyModal(false);
  };

  return (
    <div className="my-page">
      <Header />

      <div className="mypage-container">
        <nav className="breadcrumb">
          <span>
            <Link to="http://localhost:3000/customer/mypage" className="link">
              마이페이지
            </Link>{" "}
            &gt; 리뷰 관리
          </span>
        </nav>
        <h1 className="page-title">리뷰 관리</h1>
        {myReviews.length > 0 ? (
          <p className="content-count">{myReviews.length}개의 리뷰</p>
        ) : (
          "리뷰가 없습니다."
        )}
        {/* 리뷰 박스 리스트  */}
        <div className="review-box-list">
          {myReviews.map((myReview) => (
            <MyReviewLists
              key={myReview.reviewId}
              myReview={myReview}
              setMyReviews={setMyReviews}
              handleOpenModifyModal={handleOpenModifyModal}
            />
          ))}
        </div>
      </div>
      {/* 수정폼 모달 */}
      {openModifyModal && (
        <ModifyReviewModal
          review={selectedReview}
          onClose={() => setOpenModifyModal(false)}
          onSuccess={handleUpdateSuccess}
        />
      )}
      <Footer />
    </div>
  );
}

export default MyReview;
