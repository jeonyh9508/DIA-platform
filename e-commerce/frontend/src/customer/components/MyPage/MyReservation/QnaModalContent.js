import React, { useEffect, useState } from "react";

function QnaModalContent({ programTitle, insertQna, onClose }) {
  const [qnaTitle, setQnaTitle] = useState("");
  const [qnaContent, setQnaContent] = useState("");

  useEffect(() => {
    return () => {
      setQnaTitle("");
      setQnaContent("");
    };
  }, []);

  const handleSubmit = () => {
    insertQna({
      title: qnaTitle,
      content: qnaContent,
    });

    setQnaTitle("");
    setQnaContent("");
    onClose();
  };

  return (
    <div className="qna-add-container">
      <div className="qna-add-title">[{programTitle}] 프로그램 문의하기</div>
      <div className="input-qna">
        <input
          type="text"
          placeholder="문의 제목"
          className="input-title"
          value={qnaTitle}
          onChange={(e) => setQnaTitle(e.target.value)}
        />
        <textarea
          placeholder="문의하실 내용을 입력해주세요."
          value={qnaContent}
          onChange={(e) => setQnaContent(e.target.value)}
        ></textarea>

        <button className="submit-btn" onClick={handleSubmit}>
          등록
        </button>
      </div>
    </div>
  );
}

export default QnaModalContent;
