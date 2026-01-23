// src/routes/WorkshopInfo.jsx (수정된 JSX 구조)

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import WorkshopProgram from "../components/WorkshopProgram";
import Review from "../components/Review";
import Reservation from "../components/Reservation";
import FollowWish from "../components/FollowWish";
import "../css/WsInfo.css";

const WorkshopInfo = ({ ownerId, monthly }) => {
  const { workshopId } = useParams();
  const [workshop, setWorkshop] = useState(null);
  const [showDescription, setShowDescription] = useState(false);
  const navigate = useNavigate();
  console.log(workshopId);
  useEffect(() => {
    let isMounted = true;
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
        if (isMounted) setWorkshop(res.data);
      })
      .catch((err) => console.error(err));

    return () => {
      isMounted = false;
    };
  }, [workshopId, ownerId, navigate]);
  if (!workshop) return <p>로딩</p>;

  return (
    <div>
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
            <div className="workshop-description-section side-card">
              <h3 className="section-title">정보</h3>
              <div
                className={`description-container ${
                  showDescription ? "expanded" : ""
                }`}
                onClick={() => setShowDescription(!showDescription)}
              >
                <p className="description-text">설명: {workshop.description}</p>
                <span className="toggle-text">
                  {showDescription ? " 접기" : " 더보기"}
                </span>
              </div>
              <br />
              <div className="workshop-meta-detail">
                <span>주소 : {workshop.address}</span> |
                <span>연락처 : {workshop.contactNumber}</span> |
                <span>
                  <span>
                    평균 평점 :{" "}
                    <span>
                      <span style={{ color: "#ffb400" }}>
                        {console.log(workshop.averageRating)}
                        {"★".repeat(
                          workshop.averageRating !== 0
                            ? workshop.averageRating
                            : 0
                        )}
                        {"☆".repeat(
                          workshop.averageRating
                            ? 5 - workshop.averageRating
                            : 1
                        )}
                      </span>{" "}
                      <span>
                        {workshop.averageRating
                          ? workshop.averageRating.toFixed(1)
                          : "0.0"}
                      </span>
                    </span>
                  </span>
                </span>
                <p>
                  상태: {workshop.status} / 승인: {workshop.approved}
                </p>
              </div>
            </div>
            <div className="side-card follow-section">
              <FollowWish
                workshopId={workshopId}
                workshopName={workshop.name}
              />
            </div>

            <div className="side-card reservation-section">
              <Reservation workshopId={workshopId} />
            </div>

            <div className="side-card review-section">
              <Review workshopId={workshopId} />
            </div>
          </div>

          <div className="side-content">
            <div className="program-list-section side-card">
              <WorkshopProgram
                workshopId={workshopId}
                ownerId={ownerId}
                type="info"
              />
            </div>
          </div>
        </div>

        <Link to="/workshop" className="back-link">
          홈으로
        </Link>
      </div>
    </div>
  );
};

export default WorkshopInfo;
