import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/ReservationInfo.css";
import Footer from "../components/Footer";
import ProgramInfo from "../components/Reservation/ReservationInfo/ProgramInfo";
import UserInfo from "../components/Reservation/ReservationInfo/UserInfo";
import PaymentInfo from "../components/Reservation/ReservationInfo/PaymentInfo";
import PaymentModal from "../components/Reservation/ReservationInfo/PaymentModal";

function ReservationInfo({ userId }) {
  const location = useLocation();
  const {
    scheduleId,
    count,
    reservationId: passedId,
    from,
  } = location.state || {}; // Link에서 전달한 데이터
  const [scheduleInfo, setScheduleInfo] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [reservationId, setReservationId] = useState(null);
  const [numPeople, setNumPeople] = useState(0);
  const [method, setMethod] = useState(null);

  useEffect(() => {
    // 이어서 결제 (기존 예약)
    if (from === "continue" && passedId) {
      console.log("기존 예약 이어서 결제하기");

      axios
        .get(
          `http://localhost:9090/customer/continue-reservation?reservationId=${passedId}`
        )
        .then((res) => {
          setScheduleInfo(res.data.schedule);
          setUserInfo(res.data.user);
          setReservationId(res.data.reservation.reservationId);
          setNumPeople(res.data.reservation.numPeople);
          setShowModal(true);
        })
        .catch((err) => console.error("예약 정보 불러오기 오류:", err));

      return;
    }

    // 신규 예약 (프로그램 상세 페이지에서 넘어옴)
    if (scheduleId && userId) {
      console.log("새로운 예약 생성");

      axios
        .get(
          `http://localhost:9090/customer/reservation-info?scheduleId=${scheduleId}&userId=${userId}`
        )
        .then((res) => {
          setScheduleInfo(res.data.schedule);
          setUserInfo(res.data.user);
        })
        .catch((err) => console.error("프로그램 정보 불러오기 오류:", err));
    }
  }, [from, reservationId, scheduleId, userId]);

  if (!scheduleInfo) return <p>로딩 중...</p>;

  const peopleCount = count || numPeople || 0;

  const addReservation = () => {
    const total = scheduleInfo.price * count;

    const data = {
      scheduleId: scheduleId,
      userId: userId,
      numPeople: count,
      totalPrice: total,
    };

    if (
      !window.confirm(
        "[" + scheduleInfo.title + "]" + " 프로그램을 예약 하시겠습니까?"
      )
    ) {
      return;
    }

    axios
      .post("http://localhost:9090/customer/reservation/add-reservation", data)
      .then((res) => {
        if (res.data) {
          setReservationId(res.data.reservationId);
          setShowModal(true);
        } else {
          alert("프로그램 예약에 실패했습니다. 다시 시도해주세요.");
        }
      })
      .catch((err) => {
        console.error("예약 실패:", err);
        alert("예약 추가 중 오류가 발생했습니다.");
      });
  };

  const addPayment = (reservationId, method, amount) => {
    if (!window.confirm("선택한 수단으로 결제하시겠습니까?")) {
      return;
    }

    axios
      .post("http://localhost:9090/customer/payment/add-payment", {
        reservationId: reservationId,
        method,
        amount,
      })
      .then((res) => {
        if (res.data === 1) {
          setShowModal(false);

          if (
            window.confirm(
              "결제가 완료되었습니다! 결제내역 상세 페이지로 이동하시겠습니까?"
            )
          ) {
            navigate(`/customer/reservation-detail/${reservationId}`);
          } else {
            navigate(`/customer/program/${scheduleInfo.programId}`);
          }
        } else {
          alert("결제에 실패하였습니다. 다시 시도해주세요.");
        }
      })
      .catch((err) => {
        console.error("결제 오류:", err);
        alert("결제 중 오류가 발생했습니다.");
      });
  };

  const checkMethod = (selectedMethod) => {
    setMethod((prev) => (prev === selectedMethod ? "" : selectedMethod));
  };

  const closeModal = () => {
    if (
      !window.confirm(
        "결제가 완료되지 않았습니다. 결제를 취소하고 나가시겠습니까?"
      )
    ) {
      return;
    }

    navigate(`/customer/program/${scheduleInfo.programId}`);
  };

  return (
    <div>
      <Header />

      <div className="main-container">
        <div className="page-header">예약하기</div>

        <ProgramInfo scheduleInfo={scheduleInfo} />

        <UserInfo userInfo={userInfo} />

        <PaymentInfo
          scheduleInfo={scheduleInfo}
          peopleCount={peopleCount}
          addReservation={addReservation}
        />

        <PaymentModal
          showModal={showModal}
          closeModal={closeModal}
          scheduleInfo={scheduleInfo}
          peopleCount={peopleCount}
          method={method}
          checkMethod={checkMethod}
          reservationId={reservationId}
          addPayment={addPayment}
          count={count}
        />
      </div>

      <Footer />
    </div>
  );
}

export default ReservationInfo;
