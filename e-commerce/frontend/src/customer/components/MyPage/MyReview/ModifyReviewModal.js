import axios from "axios";
import React, { useEffect, useState } from "react";
import "../../../css/ModifyReviewModal.css";
import FileUpload from "../../../../workshop/components/FileUpload";

function ModifyReviewModal({ review, onClose, onSuccess }) {
  const [form, setForm] = useState({
    content: "",
    rating: 5,
  });
  const [thumb, setThumb] = useState(null);

  useEffect(() => {
    if (review) {
      setForm({
        content: review.content,
        rating: review.rating,
      });
    }
  }, [review]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!window.confirm("리뷰를 수정하시겠습니까?")) return;

    // formData는 submit 시점에 새로 만들어야 함
    const formData = new FormData();

    formData.append(
      "review",
      new Blob(
        [
          JSON.stringify({
            reviewId: review.reviewId,
            programId: review.programId,
            content: form.content,
            rating: form.rating,
          }),
        ],
        { type: "application/json" }
      )
    );

    // 이미지 파일 추가
    if (thumb) {
      formData.append("file", thumb);
    }

    try {
      const res = await axios.post(
        "http://localhost:9090/customer/review/update-review",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data === 1) {
        alert("리뷰가 수정되었습니다!");

        onSuccess({
          ...review,
          content: form.content,
          rating: form.rating,
          reviewImage: thumb ? thumb.name : review.reviewImage,
        });

        onClose();
        window.location.reload();
      } else {
        alert("리뷰 수정 실패");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modify-modal-overlay">
      <div className="modify-modal">
        <h2>리뷰 수정</h2>

        <form onSubmit={handleSubmit}>
          <div className="modify-review-content">
            <div className="review-add-form-left">
              <FileUpload
                type="single"
                name="reviewImage"
                onChange={setThumb}
              />
            </div>
            <div className="modify-review-form">
              <select
                className="review-add-rating"
                name="rating"
                value={form.rating}
                onChange={(e) =>
                  setForm({ ...form, rating: Number(e.target.value) })
                }
              >
                {[5, 4, 3, 2, 1].map((score) => (
                  <option key={score} value={score}>
                    {"★".repeat(score)}
                    {"☆".repeat(5 - score)}
                  </option>
                ))}
              </select>

              <textarea
                name="content"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
            </div>
          </div>
          <div className="modify-review-buttons">
            <button className="modify-close-btn" onClick={onClose}>
              닫기
            </button>
            <button type="submit">리뷰 수정</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModifyReviewModal;
