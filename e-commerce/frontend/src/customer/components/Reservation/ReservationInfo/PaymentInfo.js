import React from "react";

function PaymentInfo({ scheduleInfo, peopleCount, addReservation }) {
  return (
    <div className="info-box">
      <div className="info-title">결제 정보</div>
      <div className="payment-info">
        <div className="payment-row">
          <span className="label">프로그램 이용권(1매)</span>
          <span className="value">{scheduleInfo.price.toLocaleString()}원</span>
        </div>

        <div className="payment-row">
          <span className="label">예약 인원</span>
          <span className="value">{peopleCount}명</span>
        </div>

        <div className="payment-row total">
          <span className="label">총 결제 금액</span>
          <span className="value total-price">
            {(scheduleInfo.price * peopleCount).toLocaleString()}원
          </span>
        </div>
      </div>

      <div className="payment-box">
        <button className="payment-btn" onClick={addReservation}>
          결제
        </button>
      </div>
    </div>
  );
}

export default PaymentInfo;
