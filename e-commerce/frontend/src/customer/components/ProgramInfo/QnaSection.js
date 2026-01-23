import React, { useState, forwardRef, useRef, useEffect } from "react";
import "../../css/QnaSection.css";
import LoadMore from "../LoadMore";

const QnaSection = forwardRef(({ qnaWorkshops, userId, onDelete }, ref) => {
  const [visibleCount, setVisibleCount] = useState(5);
  const [expandedIds, setExpandedIds] = useState([]);
  const [expandedQnaIds, setExpandedQnaIds] = useState([]);
  const [expandedAnswerIds, setExpandedAnswerIds] = useState([]);

  const [qnaOverflow, setQnaOverflow] = useState({});
  const [answerOverflow, setAnswerOverflow] = useState({});

  const qnaRefs = useRef({});
  const answerRefs = useRef({});

  useEffect(() => {
    const newQnaOverflow = {};
    const newAnswerOverflow = {};

    qnaWorkshops.forEach((q) => {
      const id = String(q.qnaId);

      const qnaEl = qnaRefs.current[id];
      if (qnaEl) {
        newQnaOverflow[id] = qnaEl.scrollHeight > qnaEl.clientHeight + 2;
      }

      const ansEl = answerRefs.current[id];
      if (ansEl) {
        newAnswerOverflow[id] = ansEl.scrollHeight > ansEl.clientHeight + 2;
      }
    });

    setQnaOverflow(newQnaOverflow);
    setAnswerOverflow(newAnswerOverflow);
  }, [qnaWorkshops, visibleCount]);

  const toggleCard = (id) => {
    const strId = String(id);
    setExpandedIds((prev) =>
      prev.includes(strId) ? prev.filter((x) => x !== strId) : [...prev, strId]
    );
  };

  const toggleQna = (id) => {
    const strId = String(id);

    setExpandedQnaIds((prev) =>
      prev.includes(strId) ? prev.filter((x) => x !== strId) : [...prev, strId]
    );
  };

  const toggleAnswer = (id) => {
    const strId = String(id);

    setExpandedAnswerIds((prev) =>
      prev.includes(strId) ? prev.filter((x) => x !== strId) : [...prev, strId]
    );
  };

  const handleLoadMore = () => setVisibleCount((prev) => prev + 5);

  return (
    <section ref={ref} className="section">
      <div className="info-menu">문의</div>

      {qnaWorkshops.length > 0 ? (
        <ul className="qna-list">
          {qnaWorkshops.slice(0, visibleCount).map((q) => {
            const id = String(q.qnaId);
            const hasAnswer = q.answer && q.answer.trim() !== "";

            return (
              <li key={id} className="qna-set">
                <div
                  className={`card qna-card ${
                    expandedIds.includes(id) ? "expanded" : ""
                  }`}
                  onClick={() => toggleCard(id)}
                >
                  {/* 질문 영역 */}
                  <div className="qna-question">
                    <div className="card-header">
                      <span className="qna_profileImg__">
                        {q.userProfileImg ? (
                          <img
                            src={`http://localhost:9090/upload/user/${q.userId}/${q.userProfileImg}`}
                            alt="유저 프로필"
                          />
                        ) : (
                          <img
                            src={`http://localhost:9090/upload/user/default_img.jpg`}
                            alt="유저 프로필"
                          />
                        )}
                      </span>
                      <span className="user">
                        {q.userName || "탈퇴한 사용자"}
                      </span>
                      <span className="time">({q.createdAt})</span>
                    </div>

                    <div className="card-content">
                      <div className="qna-title">{q.title}</div>
                      <div
                        ref={(el) => (qnaRefs.current[id] = el)}
                        className={`expand-content ${
                          expandedQnaIds.includes(id) ? "expanded" : ""
                        }`}
                      >
                        {q.content}
                      </div>
                    </div>

                    <div className="card-footer">
                      {qnaOverflow[id] && (
                        <button
                          className="btn more"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleQna(id);
                          }}
                        >
                          {expandedQnaIds.includes(id) ? "줄이기" : "더보기"}
                        </button>
                      )}

                      {userId === q.userId && (
                        <button
                          className="btn delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(q.qnaId);
                          }}
                        >
                          삭제
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 답변 영역 — 펼쳤을 때만 보이게 */}
                  <div className="qna-answer">
                    {hasAnswer ? (
                      <>
                        <div className="card-header">
                          <i className="fi fi-tc-arrow-turn-down-right"></i>
                          <span className="user">{q.workshopName}</span>
                          <span className="time">({q.answeredAt})</span>
                        </div>

                        <div className="card-content">
                          <div
                            ref={(el) => (answerRefs.current[id] = el)}
                            className={`expand-content ${
                              expandedAnswerIds.includes(id) ? "expanded" : ""
                            }`}
                          >
                            {q.answer}
                          </div>
                        </div>

                        <div className="card-footer">
                          {answerOverflow[id] && (
                            <button
                              className="btn more"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleAnswer(id);
                              }}
                            >
                              {expandedAnswerIds.includes(id)
                                ? "줄이기"
                                : "더보기"}
                            </button>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="no-answer">등록된 답변이 없습니다.</div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>등록된 문의가 없습니다.</p>
      )}

      <LoadMore
        visibleCount={visibleCount}
        items={qnaWorkshops}
        handleLoadMore={handleLoadMore}
      />
    </section>
  );
});

export default QnaSection;
