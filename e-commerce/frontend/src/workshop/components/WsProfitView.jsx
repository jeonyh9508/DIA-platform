import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import WsModal from "./WsModal";
import "../css/WsProfitView.css";
function WsProfitView({ workshopId }) {
  const [profitList, setProfitList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [paid, setPaid] = useState(null);

  const fetchProfitData = useCallback(() => {
    if (!workshopId) return;

    setLoading(true);

    axios
      .post("http://localhost:9090/workshop/profit/view", {
        workshopId: workshopId,
      })
      .then((res) => {
        setProfitList(res.data || []);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError("정산 데이터를 불러오는데 실패했습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [workshopId]);

  useEffect(() => {
    fetchProfitData();
  }, [fetchProfitData]);

  const handleCloseModal = () => {
    setMonthly(null);
    setPaid(null);
    fetchProfitData();
  };

  if (loading) {
    return <div className="ws-pfv-container ws-pfv-message">조회 중...</div>;
  }
  if (error) {
    return (
      <div className="ws-pfv-container ws-pfv-message ws-pfv-error">
        {error}
      </div>
    );
  }
  if (!profitList.length) {
    return (
      <div className="ws-pfv-container ws-pfv-message">
        조회된 데이터가 없습니다.
      </div>
    );
  }

  return (
    <div className="ws-pfv-container">
      <table className="ws-pfv-table">
        <thead>
          <tr>
            <th className="ws-pfv-align-center">월</th>
            <th className="ws-pfv-align-right">총 매출</th>
            <th className="ws-pfv-align-right">커미션</th>
            <th className="ws-pfv-align-center">정산상태</th>
          </tr>
        </thead>
        <tbody>
          {profitList.map((p) => (
            <tr key={`${p.monthly}-${p.paidStatus}`}>
              <td className="ws-pfv-align-center">{p.monthly}</td>
              <td className="ws-pfv-align-right">
                {p.totalAmount?.toLocaleString() || 0} 원
              </td>
              <td className="ws-pfv-align-right">
                {p.commissionAmt?.toLocaleString() || 0} 원
              </td>
              <td className="ws-pfv-status-cell">
                <span
                  className={`ws-pfv-status-text ${
                    p.paidStatus === "정산대기" ? "ws-pfv-pending" : ""
                  }`}
                >
                  {p.paidStatus}
                </span>
                {p.paidStatus === "정산대기" || p.paidStatus === "조정" ? (
                  <button
                    className="ws-pfv-btn ws-pfv-btn-action"
                    onClick={() => {
                      setMonthly(p.monthly);
                      setPaid(p);
                    }}
                  >
                    정산하기
                  </button>
                ) : (
                  <button
                    className="ws-pfv-btn ws-pfv-btn-view"
                    onClick={() => {
                      setMonthly(p.monthly);
                      setPaid(p);
                    }}
                  >
                    내역 확인
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <WsModal
        isActive={monthly !== null && paid !== null}
        type="paid"
        workshopId={workshopId}
        monthly={monthly}
        data={paid}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default WsProfitView;
