import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import WorkshopProgram from "../components/WorkshopProgram";
import ProfitChart from "../components/ProfitChart";
import WsProfitView from "../components/WsProfitView";
import "../css/WsInfo.css";
function ProfitDetail({ ownerId, monthly }) {
  const { workshopId } = useParams();
  const [workshop, setWorkshop] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!ownerId) return;

    axios
      .get(`http://localhost:9090/workshop/info`, {
        params: { workshopId, ownerId: ownerId },
      })
      .then((res) => {
        if (ownerId !== res.data.ownerId) {
          alert("본인소유 공방이 아닙니다.");
          navigate("/workshop");
        }
        setWorkshop(res.data);
      })
      .catch((err) => console.error(err));
  }, [workshopId, ownerId, navigate]);

  if (!workshop) return <p>로딩 중...</p>;

  return (
    <div className="workshop-detail-container" key={workshop.workshopId}>
      <div className="workshop-header">
        {workshop.profileImg != null ? (
          <img
            src={`http://localhost:9090/upload/workshop/${workshop.workshopId}/${workshop.profileImg}`}
            alt="워크샵 이미지"
            className="ws-profile-img"
          />
        ) : (
          <img
            src={`http://localhost:9090/upload/workshop/workshop_default.png`}
            alt="워크샵 이미지"
            className="ws-profile-img"
          />
        )}
        <h2>{workshop.name}</h2>
      </div>

      <div className="main-content-split">
        <div className="detail-info">
          {/* 공방 매출 그래프 섹션 */}
          <div className="side-card six-month-graph">
            <h3>공방 매출 조회</h3>
            <ProfitChart
              type="workshop"
              workshopId={workshopId}
              monthly={null}
            />
          </div>

          {/* 프로그램별 월 매출 그래프 섹션 */}
          <div className="side-card program-profit-graph">
            <h3>{monthly ? `${monthly} 월` : "선택된 월"} 프로그램별 매출</h3>
            <ProfitChart
              type="program"
              workshopId={workshopId}
              monthly={monthly}
            />
          </div>
        </div>

        <div className="side-content">
          <div className="program-list-section side-card">
            <WorkshopProgram
              type="profit"
              workshopId={workshopId}
              ownerId={ownerId}
              monthly={monthly}
            />
          </div>
        </div>
      </div>
      <div className="profit-log">
        <h3>정산내역</h3>
        <WsProfitView workshopId={workshopId} monthly={monthly} />
      </div>
      <Link to="/workshop" className="back-link">
        홈으로
      </Link>
    </div>
  );
}

export default ProfitDetail;
