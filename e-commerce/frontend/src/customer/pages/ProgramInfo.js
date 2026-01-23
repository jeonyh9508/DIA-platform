import React, { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../css/ProgramInfo.css";
import { toast } from "react-toastify";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WorkshopSection from "../components/ProgramInfo/WorkshopSection";
import AddressSearch from "../../workshop/components/AddressSearch";
import ReviewSection from "../components/ProgramInfo/ReviewSection";
import QnaSection from "../components/ProgramInfo/QnaSection";
import ProgramImage from "../../workshop/components/ProgramImage";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import OwnerController from "../../workshop/components/OwnerController";
import WsHeader from "../../workshop/components/WsHeader";
import { ko } from "date-fns/locale";

import ProgramDatePicker from "../components/ProgramInfo/ProgramDatePicker";
import { useAuth } from "../../App";

registerLocale("ko", ko);

function ProgramInfo() {
  const { user } = useAuth();
  const userId = user?.userId;

  const { id } = useParams();
  const [program, setProgram] = useState(null);
  const [workshop, setWorkshop] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [qnaWorkshops, setQnaWorkshops] = useState([]);

  const [loading, setLoading] = useState(true);
  const [programActive, setProgramActive] = useState();

  let [count, setCount] = useState(1);
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const [isWished, setIsWished] = useState(false);
  const [countWish, setCountWish] = useState(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const programRef = useRef(null);
  const workshopRef = useRef(null);
  const locationRef = useRef(null);
  const reviewRef = useRef(null);
  const qnaRef = useRef(null);
  const inquiryRef = useRef(null);
  const location = useLocation();

  const hasLogged = useRef(false);

  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const capacities = schedules.map((s) => s.capacity);
  const max = Math.max(...capacities);

  useEffect(() => {
    if (!id || hasLogged.current) {
      return;
    }

    const sendVisitLog = async () => {
      try {
        hasLogged.current = true;

        await axios.post("http://localhost:9090/erp-system/visit-log", {
          workshopId: null,
          programId: id,
        });
        console.log("방문 로그 전송 성공"); // 개발 중에만 확인용
      } catch (err) {
        console.error("방문 로그 저장 실패:", err);
      }
    };

    if (id) {
      sendVisitLog();
    }
  }, []);

  useEffect(() => {
    if (location.state?.scrollToQna) {
      setTimeout(() => {
        qnaRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, [location.state, qnaWorkshops]);

  useEffect(() => {
    const date = new Date().toISOString().split("T")[0];
    setSelectedDate(date);
  }, []);

  const fetchProgramInfo = useCallback(() => {
    axios
      .get("http://localhost:9090/customer/program-info", {
        params: {
          programId: id,
          userId: userId,
        },
      })
      .then((res) => {
        setProgram(res.data.program);
        setWorkshop(res.data.workshop);
        setSchedules(res.data.scheduleList);
        setReviews(res.data.reviewList);
        setQnaWorkshops(res.data.qnaWorkshopList);
        setIsWished(res.data.wish);
        setCountWish(res.data.program.countWish);
        setProgramActive(res.data.program.active);
        setLoading(false);
        console.log(res.data.program.active);
        console.log(res.data.wish);
      })
      .catch((err) => console.error("프로그램 정보 불러오기 오류:", err));
  }, [id, userId]);

  useEffect(() => {
    if (!id) return;
    if (user === undefined) return; // useAuth 로딩 중이면 실행 X -> wish 늦게 불러오는 것 방지

    fetchProgramInfo();
  }, [id, user, fetchProgramInfo]);

  if (!program || !workshop) return <p>로딩 중...</p>;

  function down() {
    if (count > 1) {
      setCount(--count);
    }
  }

  function up() {
    const schedule = schedules.find((s) => s.scheduleId === selectedSchedule);
    if (!schedule) {
      toast.error("일정을 먼저 선택해주세요!");
      return;
    }

    const remain_attendees =
      Number(schedule.capacity) - Number(schedule.currentAttendees);

    if (count === remain_attendees) {
      toast.error("최대 수강 인원을 초과하였습니다!");
      return;
    }
    setCount(++count);
  }

  const filteredSchedules = schedules.filter((s) => {
    if (!s.startTime) return false;

    // s.startTime이 number이면 Date로 변환 후 yyyy-MM-dd
    const scheduleDate =
      typeof s.startTime === "number"
        ? new Date(s.startTime).toISOString().split("T")[0]
        : s.startTime.split
        ? s.startTime.split(" ")[0]
        : null;

    if (!scheduleDate) return false;

    return (
      selectedDate === "" || (scheduleDate === selectedDate && s.active == true)
    );
  });

  const resetSelection = () => {
    setSelectedSchedule(null);
    setCount(1);
  };

  const selectSchedule = (schedule) => {
    const id = schedule.scheduleId;

    if (selectedSchedule === id) {
      // 같은 일정을 다시 클릭하면 선택 해제
      setSelectedSchedule(null);
      setCount(1);
    } else {
      // 다른 일정을 선택
      setSelectedSchedule(id);
      setCount(1);
    }
  };

  const selectReservation = () => {
    if (!selectedSchedule) {
      toast.error("예약할 일정을 선택해주세요!");
      return;
    }

    navigate("/customer/reservation-info", {
      state: { scheduleId: selectedSchedule, count: count },
    });
  };

  // 하트 버튼 클릭 시
  const clickWishBtn = () => {
    if (!userId) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    const wishData = {
      userId: userId,
      programId: id,
    };

    axios
      .post("http://localhost:9090/customer/wish/wish-program", wishData)
      .then((res) => {
        const active = res.data;
        setIsWished(active);

        // 위시 수 즉시 반영
        setCountWish((prevCount) => (isWished ? prevCount - 1 : prevCount + 1));
        if (!isWished) {
          toast("💖 위시리스트에 추가되었습니다.");
        } else {
          toast("🤍 위시리스트에서 삭제되었습니다.");
        }
      })
      .catch((err) => console.error("위시 상태 변경 오류:", err));
  };

  const delReview = (reviewId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) {
      return;
    }

    axios
      .get("http://localhost:9090/customer/review/delete-review", {
        params: { reviewId: reviewId },
      })
      .then((res) => {
        if (res.data === 1) {
          toast.success("리뷰가 삭제되었습니다!");
          setReviews((prev) => prev.filter((r) => r.reviewId !== reviewId));

          setProgram((prev) => ({
            ...prev,
            countReview: prev.countReview - 1,
          }));
        } else {
          toast.error("리뷰 삭제에 실패했습니다. 다시 시도해주세요.");
        }
      })
      .catch((err) => {
        toast.error("리뷰 삭제 중 오류가 발생했습니다.");
        console.error("리뷰 삭제 실패:", err);
      });
  };

  const delQna = (qnaId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) {
      return;
    }

    axios
      .get("http://localhost:9090/customer/qna/delete-qna", {
        params: { qnaId: qnaId },
      })
      .then((res) => {
        if (res.data === 1) {
          toast.success("문의 내역이 삭제되었습니다!");
          setQnaWorkshops((prev) => prev.filter((q) => q.qnaId !== qnaId));

          setProgram((prev) => ({
            ...prev,
            countQna: prev.countQna - 1,
          }));
        } else {
          toast.error("삭제에 실패했습니다. 다시 시도해주세요.");
        }
      })
      .catch((err) => {
        toast.error("문의 삭제 중 오류가 발생했습니다.");
        console.error("문의 삭제 실패:", err);
      });
  };

  const addQna = () => {
    if (!title.trim() || !content.trim()) {
      toast.error("제목과 내용을 모두 입력해주세요!");
      return;
    }

    if (userId == null) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    const data = {
      userId: userId,
      programId: id,
      title: title,
      content: content,
    };

    axios
      .post("http://localhost:9090/customer/qna/register-qna", data)
      .then((res) => {
        if (res.data) {
          toast.success("문의가 등록되었습니다!");

          setQnaWorkshops((prev) => [res.data, ...prev]);

          // nav-bar 문의 개수 증가
          setProgram((prev) => ({
            ...prev,
            countQna: prev.countQna + 1,
          }));

          setTitle("");
          setContent("");

          //  등록 완료 후 문의 목록으로 스크롤 이동
          if (qnaRef && qnaRef.current) {
            qnaRef.current.scrollIntoView({ behavior: "smooth" });
          }
        } else {
          alert("문의 등록에 실패했습니다. 다시 시도해주세요.");
        }
      })
      .catch((err) => {
        toast.error("문의 등록 중 오류가 발생했습니다.");
        console.error("문의 등록 실패:", err);
      });
  };

  return (
    <div>
      {userId !== workshop.ownerId ? <Header /> : <WsHeader ownerId={userId} />}

      <div className="program-container">
        <div className="program-header-container">
          <div className="program-header">
            <div
              className={`program-img ${
                program.thumb == null ? "no-image" : ""
              }`}
            >
              {program.thumb != null ? (
                <img
                  src={`http://localhost:9090/upload/workshop/${workshop.workshopId}/program/${program.programId}/${program.thumb}`}
                  alt="프로그램 썸네일"
                />
              ) : (
                <p>이미지 없음</p>
              )}
            </div>

            <div className="card-stats">
              <span className="card-rating">
                ⭐ {program.avgRating?.toFixed(1)} ({program.countReview})
              </span>
              <span className="card-likes">❤️ {countWish}</span>
            </div>
          </div>

          <div className="program-schedule">
            {programActive ? (
              <>
                <h3 className="info-menu">프로그램 일정</h3>
                <div className="select-date">
                  <ProgramDatePicker
                    schedules={schedules}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    resetSelection={resetSelection}
                  />
                </div>
                <div className="schedule-box">
                  {filteredSchedules.length > 0 ? (
                    <ul>
                      {filteredSchedules.map((schedule) => {
                        return (
                          <li
                            key={schedule.scheduleId}
                            className={`schedule-list
              ${selectedSchedule === schedule.scheduleId ? "selected" : ""}
              ${schedule.status === "마감" ? "disabled" : ""}`}
                            onClick={() =>
                              schedule.status !== "마감" &&
                              selectSchedule(schedule)
                            }
                          >
                            <div>{schedule.scheduleTime}</div>
                            <div>
                              {schedule.currentAttendees}/{schedule.capacity}명
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p>개설된 일정이 없습니다.</p>
                  )}
                </div>

                <div className="select-count">
                  <span>인원 선택</span>
                  <input
                    type="button"
                    value="-"
                    className="count-btn"
                    onClick={down}
                    disabled={count <= 1}
                  />
                  <input
                    type="number"
                    value={count}
                    className="count-input"
                    onChange={(e) => setCount(e.target.value)}
                  />
                  <input
                    type="button"
                    value="+"
                    className="count-btn"
                    onClick={up}
                  />
                </div>
                <p className="price-count">
                  {(program.price * count).toLocaleString()}원 / {count}인
                </p>
                <div className="btn-bar">
                  <button
                    className={`wish-likes ${isWished ? "liked" : ""}`}
                    onClick={clickWishBtn}
                  >
                    ♡
                  </button>
                  <div>
                    <button
                      className="qna-btn"
                      onClick={() => scrollToSection(inquiryRef)}
                    >
                      문의하기
                    </button>
                    <button
                      className="reservation-btn"
                      onClick={selectReservation}
                    >
                      예약하기
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h3>비활성화 된 클래스입니다.</h3>
                <div className="schedule-box deactivate-program">
                  <p>예약에 어려움을 드려 죄송합니다.</p>
                </div>
                <div className="btn-bar">
                  <button
                    className={`wish-likes ${isWished ? "liked" : ""}`}
                    onClick={clickWishBtn}
                  >
                    ♡
                  </button>
                  <div>
                    <button
                      className="qna-btn"
                      onClick={() => scrollToSection(inquiryRef)}
                    >
                      문의하기
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="program-title">
          [{workshop.name}] {program.title}
        </div>

        <div className="info-bar">
          <span>{program.category}</span>
          <span>{program.durationMin}분</span>
          <span>{workshop.address}</span>
          <span>{program.difficulty}</span>
          {schedules.length > 0 ? (
            <span>1~{max}명</span>
          ) : (
            <span>인원 미정</span>
          )}
        </div>

        <nav className="nav-bar">
          <button onClick={() => scrollToSection(programRef)}>
            프로그램 소개
          </button>
          <button onClick={() => scrollToSection(workshopRef)}>
            공방 소개
          </button>
          <button onClick={() => scrollToSection(locationRef)}>위치</button>
          <button onClick={() => scrollToSection(reviewRef)}>
            리뷰 ({program.countReview})
          </button>
          <button onClick={() => scrollToSection(qnaRef)}>
            문의 ({program.countQna})
          </button>
        </nav>

        <section ref={programRef} className="section">
          <div className="info-menu">프로그램 소개</div>
          <div className="info-desc">{program.description}</div>
          <ProgramImage
            workshopId={program.workshopId}
            programId={program.programId}
          />
        </section>

        <WorkshopSection ref={workshopRef} workshop={workshop} />

        <section ref={locationRef} className="section">
          <div className="location-section">
            <div className="info-menu">위치</div>
            <div className="info-desc">{workshop.address}</div>
            <div className="location-map">
              <div className="workshop-location">
                <AddressSearch workshopLoc={workshop.address} />
              </div>
            </div>
          </div>
        </section>

        <ReviewSection
          ref={reviewRef}
          reviews={reviews}
          userId={userId}
          onDelete={delReview}
        />

        <QnaSection
          ref={qnaRef}
          qnaWorkshops={qnaWorkshops}
          userId={userId}
          onDelete={delQna}
        />

        <section ref={inquiryRef} className="section">
          <div className="info-menu">문의하기</div>
          <div className="input-qna">
            <input
              type="text"
              placeholder="문의 제목"
              className="input-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="문의하실 내용을 입력해주세요."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>

            <button className="submit-btn" onClick={addQna}>
              등록
            </button>
          </div>
        </section>
      </div>

      {workshop && userId === workshop.ownerId && (
        <OwnerController
          programId={id}
          programTitle={program.title}
          workshopId={program.workshopId}
          userId={userId}
          data={fetchProgramInfo}
        />
      )}
      <Footer />
    </div>
  );
}

export default ProgramInfo;
