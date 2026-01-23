import React, { useEffect, useState } from "react";
import "../css/ReservationDetail.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProgramInfo from "../components/Reservation/ReservatioinDetail/ProgramInfo";
import UserInfo from "../components/Reservation/ReservatioinDetail/UserInfo";
import PaymentInfo from "../components/Reservation/ReservatioinDetail/PaymentInfo";

function ReservationDetail({ userId }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [isCancelled, setIsCancelled] = useState(false);

  useEffect(() => {
    axios
      .get(
        `http://localhost:9090/customer/reservation-detail?reservationId=${id}`
      )
      .then((res) => {
        setReservation(res.data);
      })
      .catch((err) => console.error("프로그램 정보 불러오기 오류:", err));
  }, [id]);

  if (!reservation) return <p>로딩 중...</p>;

  const isRefunded = reservation.paymentStatus === "환불";

  const continuePayment = () => {
    if (
      !window.confirm(
        "아직 결제가 완료되지 않았습니다. 이어서 결제하시겠습니까?"
      )
    ) {
      return;
    }

    navigate("/customer/reservation-info", {
      state: {
        reservationId: reservation.reservationId,
        from: "continue", // 어디서 왔는지 표시용
      },
    });
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
          alert("예약이 취소되었습니다.");

          // 상태 즉시 반영!
          setReservation((prev) => ({
            ...prev,
            status: "취소",
          }));

          setIsCancelled(true); // 예약 취소 버튼 비활성화
        } else {
          alert("예약 취소가 실패했습니다.");
        }
      })
      .catch((err) => {
        console.error("예약 취소 실패:", err);
        alert("예약 취소 중 오류가 발생했습니다.");
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
            <Link
              to="http://localhost:3000/customer/my-reservation"
              className="link"
            >
              &gt; 결제 및 예약 내역
            </Link>{" "}
            &gt; 결제 및 예약 상세 정보
          </span>
        </nav>

        <h1 className="page-title">결제 및 예약 상세 정보</h1>

        <div className="reservation-info-box">
          <div className="reservation-header">
            <div className={`reservation-status ${reservation.status}`}>
              {reservation.status}
            </div>

            {reservation.status === "대기" && (
              <button className="continue-pay-btn" onClick={continuePayment}>
                결제하기
              </button>
            )}
          </div>

          <ProgramInfo reservation={reservation} />

          <div className="info-section">
            <UserInfo reservation={reservation} />
            <PaymentInfo
              reservation={reservation}
              isCancelled={isCancelled}
              isRefunded={isRefunded}
            />
          </div>
        </div>

        <div className="btn-set">
          <button
            className="cancle-btn"
            onClick={() => cancelReservation(reservation.reservationId)}
            disabled={
              isCancelled ||
              reservation.status === "수강종료" ||
              reservation.status === "취소"
            }
          >
            예약 취소
          </button>
          <button
            className="back-btn"
            onClick={() => navigate("/customer/my-reservation/")}
          >
            목록
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ReservationDetail;
