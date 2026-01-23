import React from "react";

function PaymentInfo({ reservation, isCancelled, isRefunded }) {
  return (
    <div className="info-box">
      <div className="info-title">결제 정보</div>
      <div className="payment-info">
        <div className="info-grid">
          <div className="label">결제 방법</div>
          <div
            className={`value ${isCancelled || isRefunded ? "refunded" : ""}`}
          >
            {reservation.method === "CARD"
              ? "카드 결제"
              : reservation.method === "BANK"
              ? "무통장 입금"
              : reservation.method === "KAKAOPAY"
              ? "카카오페이"
              : reservation.method === "NAVERPAY"
              ? "네이버페이"
              : reservation.method || "-"}
          </div>

          <div className="label">금액 (인원)</div>
          <div className="value">
            {reservation.price.toLocaleString()}원 ({reservation.numPeople}인)
          </div>

          <div className="label">총 결제 금액</div>
          <div
            className={`value ${isCancelled || isRefunded ? "refunded" : ""}`}
          >
            {reservation.totalPrice
              ? `${reservation.totalPrice.toLocaleString()}원`
              : "-"}
          </div>

          <div className="label">결제 일시</div>
          <div className="value">{reservation.paidAt || "-"}</div>
        </div>
      </div>
    </div>
  );
}

export default PaymentInfo;
