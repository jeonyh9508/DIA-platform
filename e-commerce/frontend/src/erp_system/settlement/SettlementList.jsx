import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import "./css/SettlementList.css";
import SettlementStatus from "./components/SettlementStatus";
import Unsettlement from "./components/Unsettlement";

function SettlementView({ adminId }) {
  const [settlement, setSettlement] = useState([]);
  const [activeTab, setActiveTab] = useState("unsettled");
  const [filter, setFilter] = useState(null);

  const fetchSettlement = useCallback(() => {
    let statusParam = null;

    if (activeTab === "processing") statusParam = "정산중";
    if (activeTab === "completed") statusParam = filter;

    axios
      .post("http://localhost:9090/erp-system/settlement/view", {
        status: statusParam,
      })
      .then((res) => {
        let data = res.data;

        if (activeTab === "completed") {
          data = data.filter((s) => s.status !== "정산중");
        }

        setSettlement(data);
      })
      .catch((err) => console.log(err));
  }, [activeTab, filter]);

  useEffect(() => {
    fetchSettlement();
  }, [fetchSettlement]);

  return (
    <div className="settle-approval-page">
      <div className="settle-approval-container">
        <h2>정산 처리</h2>
        <div className="settle-tabs">
          <button
            className={activeTab === "unsettled" ? "active" : ""}
            onClick={() => setActiveTab("unsettled")}
          >
            미정산
          </button>
          <button
            className={activeTab === "processing" ? "active" : ""}
            onClick={() => setActiveTab("processing")}
          >
            처리중
          </button>
          <button
            className={activeTab === "completed" ? "active" : ""}
            onClick={() => setActiveTab("completed")}
          >
            처리완료
          </button>
        </div>

        {activeTab === "unsettled" && <Unsettlement />}

        {(activeTab === "processing" || activeTab === "completed") && (
          <div>
            {activeTab === "completed" && (
              <div className="status-radio">
                <label>
                  <input
                    type="radio"
                    name="completedStatus"
                    value=""
                    checked={filter === null}
                    onChange={() => setFilter(null)}
                  />
                  전체
                </label>
                <label>
                  <input
                    type="radio"
                    name="completedStatus"
                    value="정산완료"
                    checked={filter === "정산완료"}
                    onChange={(e) => setFilter(e.target.value)}
                  />
                  정산완료
                </label>
                <label>
                  <input
                    type="radio"
                    name="completedStatus"
                    value="환불"
                    checked={filter === "환불"}
                    onChange={(e) => setFilter(e.target.value)}
                  />
                  환불
                </label>
                <label>
                  <input
                    type="radio"
                    name="completedStatus"
                    value="조정"
                    checked={filter === "조정"}
                    onChange={(e) => setFilter(e.target.value)}
                  />
                  조정
                </label>
              </div>
            )}

            <SettlementStatus
              settlement={settlement}
              fetchSettlement={fetchSettlement}
              adminId={adminId}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default SettlementView;
