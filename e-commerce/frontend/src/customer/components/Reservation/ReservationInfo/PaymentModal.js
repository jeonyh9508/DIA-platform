import React from "react";
import Modal from "../../Modal";

function PaymentModal({
  showModal,
  closeModal,
  scheduleInfo,
  peopleCount,
  method,
  checkMethod,
  reservationId,
  addPayment,
  count,
}) {
  return (
    <Modal isOpen={showModal} onClose={closeModal}>
      <div className="payment-modal">
        <div className="payment-header">결제하기</div>

        <div className="program-summary">
          <div className="program-title">{scheduleInfo.title}</div>
          <div className="program-price">
            {scheduleInfo.price.toLocaleString()}원 ({peopleCount}인)
          </div>
        </div>

        <div className="payment-methods">
          <div className="select-methods">결제 수단을 선택하세요.</div>
          <div className="method-buttons">
            <button
              className={`method-btn ${method === "CARD" ? "selected" : ""}`}
              onClick={() => checkMethod("CARD")}
            >
              💳 카드 결제
            </button>
            <button
              className={`method-btn ${method === "BANK" ? "selected" : ""}`}
              onClick={() => checkMethod("BANK")}
            >
              💵 무통장 입금
            </button>
            <button
              className={`method-btn ${
                method === "KAKAOPAY" ? "selected" : ""
              }`}
              onClick={() => checkMethod("KAKAOPAY")}
            >
              🟡 카카오페이
            </button>
            <button
              className={`method-btn ${
                method === "NAVERPAY" ? "selected" : ""
              }`}
              onClick={() => checkMethod("NAVERPAY")}
            >
              🟢 네이버페이
            </button>
          </div>
        </div>

        <div className="payment-summary">
          <div className="summary-row">
            <span>결제 금액</span>
            <span className="amount">
              {(scheduleInfo.price * peopleCount).toLocaleString()}원
            </span>
          </div>
        </div>

        <div className="payment-buttons">
          <button
            className="pay-btn"
            onClick={() =>
              addPayment(reservationId, method, scheduleInfo.price * count)
            }
            disabled={!method}
          >
            결제하기
          </button>
          <button className="pay-close-btn" onClick={closeModal}>
            닫기
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default PaymentModal;
