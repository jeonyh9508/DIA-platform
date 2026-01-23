import axios from "axios";
import React, { useEffect, useState } from "react";
import "../css/PaidProfit.css";

function PaidProfit({ workshopId, monthly, paid, onClose }) {
  const [programProfit, setProgramProfit] = useState([]);
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(false);

  useEffect(() => {
    if (!workshopId || !monthly) {
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .post("http://localhost:9090/workshop/profit/view-program", {
        workshopId: workshopId,
        monthly: monthly,
      })
      .then((res) => {
        setProgramProfit(res.data || []);
      })
      .catch((err) => {
        console.error("프로그램별 정산 내역 조회 오류:", err);
        setProgramProfit([]);
      })
      .finally(() => setLoading(false));
  }, [workshopId, monthly]);

  const netProfit = paid?.totalAmount - paid?.commissionAmt;

  if (loading) {
    return (
      <div className="ws-paid-profit-container">
        <p className="ws-profit-loading">정산 상세 내역을 불러오는 중...</p>
      </div>
    );
  }
  const handleConfirmClick = () => {
    setAccount(true);
  };

  const handlePaySubmit = () => {
    if (!window.confirm("납부하시겠습니까?")) {
      return;
    }
    axios
      .post("http://localhost:9090/workshop/profit/pay-profit", {
        workshopId: workshopId,
        monthly: monthly,
      })
      .then((res) => {
        alert("납부 처리가 완료되었습니다.");
        onClose();
      })
      .catch((err) => {
        console.error("납부 처리 오류:", err);
        alert("납부 처리 중 오류가 발생했습니다.");
      });
  };

  const handleAdjustSubmit = () => {
    if (!window.confirm("재납부하시겠습니까?")) {
      return;
    }
    axios
      .post("http://localhost:9090/workshop/profit/pay-profit", {
        workshopId: workshopId,
        monthly: monthly,
        finalAmount: paid.finalAmount,
        adjustAmount: paid.adjustAmount,
      })
      .then((res) => {
        alert("재납부 처리가 완료되었습니다.");
        onClose();
      })
      .catch((err) => {
        console.error("납부 처리 오류:", err);
        alert("납부 처리 중 오류가 발생했습니다.");
      });
  };
  const thisMonth = new Date().toISOString().slice(0, 7);

  return (
    <div className="ws-paid-profit-container">
      <h3 className="ws-profit-title">
        {monthly ? `${monthly} 정산 상세 영수증` : "정산 상세 내역"}
      </h3>
      {programProfit.length === 0 ? (
        <p className="ws-profit-empty">
          선택하신 월의 프로그램별 정산 내역이 없습니다.
        </p>
      ) : (
        <div>
          <div className="ws-profit-table-wrapper">
            <table className="ws-profit-table">
              <thead>
                <tr>
                  <th>프로그램명</th>
                  <th className="ws-align-right">매출</th>
                  <th className="ws-align-right">
                    수수료(기본수수료(50,000)포함)
                  </th>
                </tr>
              </thead>
              <tbody>
                {programProfit.map((p, index) => (
                  <tr key={p.profitId || index}>
                    <td>{p.title || `프로그램 ID: ${p.programId}`}</td>
                    <td className="ws-align-right">
                      {p.totalAmount?.toLocaleString() || 0}원
                    </td>
                    <td className="ws-align-right">
                      ({p.commissionAmt?.toLocaleString() || 0})원
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="ws-profit-summary">
            <div className="ws-summary-row">
              <span className="ws-summary-label">총매출 합계:</span>
              <span className="ws-summary-value">
                {paid.totalAmount.toLocaleString()} 원
              </span>
            </div>
            <div className="ws-summary-row">
              <span className="ws-summary-label">수수료 제외 수익:</span>
              <span className="ws-summary-value">
                {netProfit.toLocaleString()} 원
              </span>
            </div>
            {paid.paidStatus === "환불" ? (
              <div className="ws-summary-row">
                <span className="ws-summary-label">환불 금액:</span>
                <span className="ws-summary-value">
                  {paid.finalAmount === null ? (
                    <>-{paid.commissionAmt.toLocaleString()} 원</>
                  ) : (
                    <>-{paid.finalAmount.toLocaleString()} 원</>
                  )}
                </span>
              </div>
            ) : (
              paid.adjustAmount !== 0 &&
              paid.adjustAmount !== null && (
                <div className="ws-summary-row">
                  <span className="ws-summary-label">조정 금액:</span>
                  <span className="ws-summary-value">
                    {paid.adjustAmount?.toLocaleString()}원
                  </span>
                </div>
              )
            )}

            <div className="ws-summary-row ws-summary-total">
              <span className="ws-summary-label">납부 수수료:</span>
              {paid.paidStatus === "환불" ? (
                <span className="ws-summary-value ws-negative"> 0 원</span>
              ) : (
                <span className="ws-summary-value ws-negative">
                  {paid.finalAmount === null ? (
                    <>({paid.commissionAmt.toLocaleString()} 원)</>
                  ) : (
                    <>({paid.finalAmount.toLocaleString()} 원)</>
                  )}
                </span>
              )}
            </div>
          </div>
          {(paid.paidStatus === "정산대기" || paid.paidStatus === "조정") &&
            !account && (
              <div className="ws-profit-actions">
                {monthly === thisMonth ? (
                  <div className="ws-profit-block-msg">
                    익월 1일 이후 정산 가능합니다.
                  </div>
                ) : (
                  <button
                    onClick={handleConfirmClick}
                    className="ws-btn-confirm"
                  >
                    정산 계좌 확인
                  </button>
                )}
              </div>
            )}
        </div>
      )}
      {account &&
        (paid.paidStatus === "정산대기" || paid.paidStatus === "조정") && (
          <div className="ws-account-info">
            <h3 className="ws-account-title">정산 계좌 정보</h3>
            <div className="ws-account-details">
              <div>681702-00-110740(국민은행)</div>
              <div>예금주명 : 전 * 현</div>
            </div>
            <div className="ws-account-buttons">
              {paid.paidStatus === "정산대기" ? (
                <button onClick={handlePaySubmit} className="ws-btn-confirm">
                  최종 정산 요청
                </button>
              ) : (
                <button onClick={handleAdjustSubmit} className="ws-btn-confirm">
                  재정산 요청
                </button>
              )}

              <button
                onClick={() => setAccount(false)}
                className="ws-btn-cancel"
              >
                취소
              </button>
            </div>
          </div>
        )}
    </div>
  );
}

export default PaidProfit;
