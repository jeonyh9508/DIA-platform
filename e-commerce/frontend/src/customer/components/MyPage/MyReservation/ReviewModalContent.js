import React, { useState } from "react";
import FileUpload from "../../../../workshop/components/FileUpload";

function ReviewModalContent({
  programTitle,
  programId,
  workshopId,
  reservationId,
  insertReview,
  onClose,
}) {
  const [rating, setRating] = useState(5);
  const [thumb, setThumb] = useState(null);
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!content.trim()) {
      alert("리뷰 내용을 입력해주세요.");
      return;
    }

    insertReview({
      rating,
      thumb,
      content,
      programId,
      workshopId,
      reservationId,
    });

    setContent("");
    setThumb(null);
    setRating(5);

    onClose();
  };

  return (
    <div className="review-add-container">
      <h2 className="review-form-title">[{programTitle}] 프로그램 리뷰 작성</h2>
      <form className="review-add-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="review-add-form-group">
            <div className="review-add-form-left">
              <FileUpload
                type="single"
                name="reviewImage"
                onChange={setThumb}
              />
            </div>

            <div className="review-add-form-right">
              <div>
                <select
                  name="rating"
                  className="review-add-rating"
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value="5">★★★★★</option>
                  <option value="4">★★★★☆</option>
                  <option value="3">★★★☆☆</option>
                  <option value="2">★★☆☆☆</option>
                  <option value="1">★☆☆☆☆</option>
                </select>

                <textarea
                  name="content"
                  placeholder="리뷰 내용을 입력해주세요"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="form-buttons">
          <button type="submit" className="submit-btn">
            리뷰 등록
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReviewModalContent;
