import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../css/MyReservation.css";
import Footer from "../components/Footer";
import Modal from "../components/Modal";
import ReservationCard from "../components/MyPage/MyReservation/ReservationCard";
import QnaModalContent from "../components/MyPage/MyReservation/QnaModalContent";
import ReviewModalContent from "../components/MyPage/MyReservation/ReviewModalContent";
import { toast } from "react-toastify";

function MyReservation({ userId }) {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [isCancelled, setIsCancelled] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);

  const [filter, setFilter] = useState("전체");
  const [statusFilter, setStatusFilter] = useState({
    대기: true,
    확정: true,
    수강종료: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qnaModal, setQnaModal] = useState(false);

  const [programTitle, setProgramTitle] = useState(null);
  const [programId, setProgramId] = useState(null);
  const [reservationId, setReservationId] = useState(null);
  const [workshopId, setWorkshopId] = useState(null);

  useEffect(() => {
    setVisibleCount(5);
  }, [filter, statusFilter]);

  useEffect(() => {
    if (filter === "예약") {
      setStatusFilter({ 대기: true, 확정: true, 수강종료: true });
    }
  }, [filter]);

  useEffect(() => {
    axios
      .get(`http://localhost:9090/customer/my-reservation?userId=${userId}`)
      .then((res) => setReservations(res.data))
      .catch((err) => console.error("프로그램 정보 불러오기 오류:", err));
  }, [userId]);

  const filteredList = reservations.filter((item) => {
    if (filter === "전체") return true;
    if (filter === "취소") return item.status === "취소";
    if (filter === "예약") {
      return item.status !== "취소" && statusFilter[item.status];
    }

    return true;
  });

  const handleLoadMore = () => setVisibleCount((prev) => prev + 5);

  const changeStatus = (status) => {
    setStatusFilter((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  const cancelReservation = (id) => {
    if (!window.confirm("예약을 취소하시겠습니까?")) {
      return;
    }

    axios
      .post("http://localhost:9090/customer/reservation/cancel-reservation", {
        reservationId: id,
      })
      .then((res) => {
        if (res.data === 1) {
          toast.success("예약이 취소되었습니다.");

          // 상태 즉시 반영!
          setReservations((prev) =>
            prev.map((item) =>
              item.reservationId === id ? { ...item, status: "취소" } : item
            )
          );

          setIsCancelled(true); // 예약 취소 버튼 비활성화
        } else {
          toast.error("예약 취소가 실패했습니다.");
        }
      })
      .catch((err) => {
        console.error("예약 취소 실패:", err);
        toast.error("예약 취소 중 오류가 발생했습니다.");
      });
  };

  const onClose = () => {
    setIsModalOpen(false);
    setProgramId(null);
    setReservationId(null);
    setWorkshopId(null);
    setQnaModal(false);
  };

  function insertReview({
    rating,
    thumb,
    content,
    programId,
    workshopId,
    reservationId,
  }) {
    const data = {
      userId,
      workshopId: workshopId,
      programId: programId,
      reservationId: reservationId,
      rating,
      content,
    };

    const formData = new FormData();
    formData.append(
      "review",
      new Blob([JSON.stringify(data)], { type: "application/json" })
    );

    if (thumb) {
      formData.append("file", thumb);
    }
    axios
      .post("http://localhost:9090/customer/review/insert", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        toast.success("리뷰가 등록되었습니다.");
        onClose();
        navigate("/customer/my-review");
      })
      .catch((err) => console.error("리뷰 등록 실패:", err));
  }

  const openReviewModal = (reservation) => {
    axios
      .post("http://localhost:9090/customer/review/exist-check", {
        programId: reservation.programId,
        reservationId: reservation.reservationId,
        userId: userId,
      })
      .then((res) => {
        if (res.data > 0) {
          if (
            window.confirm(
              "이미 작성한 리뷰가 존재합니다.\n리뷰 관리 페이지로 이동하시겠습니까?"
            )
          ) {
            navigate("/customer/my-review");
          }
          return;
        }
        setIsModalOpen(true);
        setReservationId(reservation.reservationId);
        setProgramId(reservation.programId);
        setProgramTitle(reservation.title);
        setWorkshopId(reservation.workshopId);
      })
      .catch((err) => {
        console.error("리뷰 존재 여부 확인 실패:", err);
      });
  };

  const openQnaModal = (reservation) => {
    setQnaModal(true);
    setProgramTitle(reservation.title);
    setProgramId(reservation.programId);
  };

  const insertQna = ({ title, content }) => {
    if (!title.trim() || !content.trim()) {
      toast.error("제목과 내용을 모두 입력해주세요!");
      return;
    }

    const data = {
      userId,
      programId: programId,
      title,
      content,
    };

    axios
      .post("http://localhost:9090/customer/qna/insert-qna", data)
      .then((res) => {
        if (res.data === 1) {
          toast.success("문의가 등록되었습니다!");

          setQnaModal(false);
        } else {
          toast.error("문의 등록에 실패했습니다. 다시 시도해주세요.");
        }
      })
      .catch((err) => {
        toast.error("문의 등록 중 오류가 발생했습니다.");
        console.error("문의 등록 실패:", err);
      });
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
            &gt; 결제 및 예약 내역
          </span>
        </nav>

        <h1 className="page-title">결제 및 예약 내역</h1>

        <nav className="reservation-nav">
          <span
            className={`navi-all ${filter === "전체" ? "active" : ""}`}
            onClick={() => setFilter("전체")}
          >
            전체
          </span>
          <span
            className={`navi-reservation ${filter === "예약" ? "active" : ""}`}
            onClick={() => setFilter("예약")}
          >
            예약
          </span>
          <span
            className={`navi-cancel ${filter === "취소" ? "active" : ""}`}
            onClick={() => setFilter("취소")}
          >
            취소
          </span>
        </nav>

        {filter === "예약" && (
          <div className="status-filter-box">
            {["대기", "확정", "수강종료"].map((status) => (
              <label key={status}>
                <input
                  type="checkbox"
                  checked={statusFilter[status]}
                  onChange={() => changeStatus(status)}
                />
                {status}
              </label>
            ))}
          </div>
        )}

        <ReservationCard
          filteredList={filteredList}
          visibleCount={visibleCount}
          handleLoadMore={handleLoadMore}
          cancelReservation={cancelReservation}
          isCancelled={isCancelled}
          openReviewModal={openReviewModal}
          openQnaModal={openQnaModal}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={onClose}>
        <ReviewModalContent
          programTitle={programTitle}
          programId={programId}
          workshopId={workshopId}
          reservationId={reservationId}
          insertReview={insertReview}
          onClose={onClose}
        />
      </Modal>

      <Modal isOpen={qnaModal} onClose={onClose}>
        <QnaModalContent
          programTitle={programTitle}
          insertQna={insertQna}
          onClose={onClose}
        />
      </Modal>

      <Footer />
    </div>
  );
}

export default MyReservation;
