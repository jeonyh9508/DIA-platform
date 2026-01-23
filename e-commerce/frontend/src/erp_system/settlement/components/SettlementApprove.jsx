import React, { useEffect, useState } from "react";
import "../../../workshop/css/PaidProfit.css";
import axios from "axios";

function SettlementApprove({ data, onClose, fetchSettlement, adminId }) {
  const [loading, setLoading] = useState(true);
  const [programProfit, setProgramProfit] = useState([]);
  const [adjust, setAdjust] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState(null);
  const [adjustSign, setAdjustSign] = useState(1);

  useEffect(() => {
    if (!data || !data.workshopId || !data.monthly) {
      setLoading(false);
      return;
    }
    setLoading(true);
    axios
      .post("http://localhost:9090/workshop/profit/view-program", {
        workshopId: data.workshopId,
        monthly: data.monthly,
      })
      .then((res) => setProgramProfit(res.data || []))
      .catch((err) => {
        console.error("프로그램별 정산 내역 조회 오류:", err);
        setProgramProfit([]);
      })
      .finally(() => setLoading(false));
  }, [data]);

  const statusUpdate = (status) => {
    console.log(data.settlementId);
    if (status === "정산완료" || status === "환불") {
      if (!window.confirm(`${status} 처리 하시겠습니까?`)) return;

      axios
        .post("http://localhost:9090/erp-system/settlement/status-update", {
          settlementId: data.settlementId,
          status: status,
          workshopId: data.workshopId,
          workshopName: data.workshopName,
          monthly: data.monthly,
          adminCheckerId: adminId,
          ownerId: data.ownerId,
        })
        .then(() => {
          alert(`${status} 처리 되었습니다.`);
          fetchSettlement();
          onClose();
        })
        .catch((err) => console.error(err.response?.data || err));
    } else {
      axios
        .post("http://localhost:9090/erp-system/settlement/status-update", {
          settlementId: data.settlementId,
          status: status,
          adjustAmount: Number(adjustAmount) * adjustSign,
          workshopId: data.workshopId,
          workshopName: data.workshopName,
          monthly: data.monthly,
          adminCheckerId: adminId,
          ownerId: data.ownerId,
        })
        .then(() => {
          alert("금액이 조정되었습니다.");
          fetchSettlement();
          onClose();
        })
        .catch((err) => console.error(err));
    }
  };

  const handleAdjust = (e) => {
    e.preventDefault();
    if (!adjustAmount || adjustAmount <= 0) {
      alert("정확한 조정 금액을 입력해주세요.");
      return;
    }
    if (adjustSign === -1 && Number(adjustAmount) === data.originCommission) {
      alert("조정 금액이 원금과 동일합니다. 환불 처리만 가능합니다.");
      return;
    }
    statusUpdate("조정");
  };

  return (
    <div className="ws-paid-profit-container">
      <h3 className="ws-profit-title">
        {data?.monthly ? `${data.monthly} 정산 상세 영수증` : "정산 상세 내역"}
      </h3>

      {loading ? (
        <p className="ws-profit-empty">정산 상세 내역을 불러오는 중...</p>
      ) : programProfit.length === 0 ? (
        <p className="ws-profit-empty">
          선택하신 월의 프로그램별 정산 내역이 없습니다.
        </p>
      ) : (
        <div>
          <div className="ws-profit-table-wrapper">
            <table className="ws-profit-table">
              <thead>
                <tr>
                  <th>공방 명</th>
                  <th>조정 금액</th>
                  <th className="ws-align-right">수수료</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{data.workshopName}</td>
                  <td className="ws-align-right">
                    {data.adjustAmount?.toLocaleString()}원
                  </td>
                  <td className="ws-align-right">
                    {data.finalAmount?.toLocaleString()}원
                  </td>
                </tr>
              </tbody>
            </table>

            <table className="ws-profit-table">
              <thead>
                <tr>
                  <th>프로그램명</th>
                  <th className="ws-align-right">수수료</th>
                </tr>
              </thead>
              <tbody>
                {programProfit.map((p) => (
                  <tr key={p.title}>
                    <td>{p.title}</td>
                    <td className="ws-align-right">
                      {p.commissionAmt?.toLocaleString()}원
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.status === "정산중" && (
            <div className="ws-profit-btn-group">
              {data.adjustAmount === 0 && (
                <button
                  className="ws-profit-btn ws-profit-btn-adjust"
                  onClick={() => setAdjust(!adjust)}
                >
                  조정
                </button>
              )}
              <button
                className="ws-profit-btn ws-profit-btn-refund"
                onClick={() => statusUpdate("환불")}
              >
                환불
              </button>
              <button
                className="ws-profit-btn ws-profit-btn-approve"
                onClick={() => statusUpdate("정산완료")}
              >
                승인
              </button>
            </div>
          )}

          {adjust && (
            <div className="ws-profit-adjust-form">
              <form
                onSubmit={handleAdjust}
                className="ws-profit-adjust-content"
              >
                <div className="ws-adjust-form-data">
                  <select
                    className="ws-profit-select"
                    value={adjustSign}
                    onChange={(e) => setAdjustSign(Number(e.target.value))}
                  >
                    <option value={1}>증액</option>
                    <option value={-1}>차감</option>
                  </select>
                  <input
                    className="ws-profit-input"
                    type="number"
                    name="adjustAmount"
                    min={1}
                    onChange={(e) => setAdjustAmount(e.target.value)}
                    value={adjustAmount || ""}
                  />
                </div>
                <div className="ws-adjust-btn">
                  <button
                    className="ws-profit-btn ws-profit-btn-submit"
                    type="submit"
                  >
                    처리
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="ws-profit-summary">
            <div className="ws-summary-row ws-summary-total">
              <span className="ws-summary-label">납부 수수료:</span>
              <span className="ws-summary-value ws-negative">
                ({data.finalAmount.toLocaleString()}원)
              </span>
            </div>
          </div>
          {data.status !== "정산중" && <p>{data.status} 처리된 건입니다.</p>}
        </div>
      )}
    </div>
  );
}

export default SettlementApprove;
