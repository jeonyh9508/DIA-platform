import React, { useEffect, useState } from "react";
import axios from "axios";

import "../css/Profit.css";

function Profit({ ownerId, workshopId, programId, monthly }) {
  const [profit, setProfit] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ownerId && !workshopId && !programId) return;

    const fetchProfit = async () => {
      setLoading(true);
      setError(null);

      const url = "http://localhost:9090/workshop/profit/";
      let profitInfo = {};
      let endpoint = "";

      if (ownerId) {
        profitInfo.ownerId = ownerId;
        endpoint = "all";
      } else if (workshopId) {
        profitInfo.workshopId = workshopId;
        endpoint = "workshop";
      } else if (programId) {
        profitInfo.programId = programId;
        endpoint = "program";
      }

      if (monthly !== undefined) {
        profitInfo.monthly = monthly;
      }

      try {
        const res = await axios.post(url + endpoint, profitInfo);
        setProfit(res.data || []);
      } catch (err) {
        console.error(err);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfit();
  }, [ownerId, workshopId, programId, monthly]);

  if (loading) {
    return <div className="ws-pf-view-box loading">조회 중...</div>;
  }
  if (error) {
    return <div className="ws-pf-view-box error">{error}</div>;
  }
  if (!profit.length) {
    return (
      <div className="ws-pf-view-box empty">조회된 정산 내역이 없습니다.</div>
    );
  }

  return (
    <div className="ws-pf-view-box">
      {profit.map((p, idx) => {
        if (!p) return null;

        const totalAmount = p.totalAmount ?? 0;
        const commissionAmt = p.commissionAmt ?? 0;

        return (
          <div key={idx} className="ws-pf-view-item">
            {p.monthly ? (
              <span>
                {p.monthly}월 매출 : {totalAmount.toLocaleString()}원
                {!workshopId && !ownerId && commissionAmt > 0 && (
                  <span className="commission">
                    / 수수료: {commissionAmt.toLocaleString()}원
                  </span>
                )}
              </span>
            ) : (
              <span>
                총 매출 : {totalAmount.toLocaleString()}원
                {!workshopId && !ownerId && commissionAmt > 0 && (
                  <span className="commission">
                    / 수수료: {commissionAmt.toLocaleString()}원
                  </span>
                )}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Profit;
