import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Profit from "../components/Profit";
import "../css/WsList.css";

function WorkshopProfit({ ownerId, monthly }) {
  const [workshops, setWorkshops] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 6;

  useEffect(() => {
    if (!ownerId) {
      return;
    }

    axios
      .get("http://localhost:9090/workshop/home", {
        params: { ownerId: ownerId },
      })
      .then((res) => setWorkshops(res.data))
      .catch((err) => console.error("공방 목록 불러오기 오류:", err));
  }, [ownerId]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => prevIndex + itemsPerPage);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => prevIndex - itemsPerPage);
  };

  const isPrevDisabled = currentIndex === 0;
  const isNextDisabled = currentIndex + itemsPerPage >= workshops.length;

  const currentWorkshops = workshops.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

  return (
    <div className="ws-content-box">
      <div className="ws-controls">
        <div className="ws-profit-owner">
          <Profit ownerId={ownerId} />
          <Profit ownerId={ownerId} monthly={monthly} />
        </div>
      </div>
      {workshops.length > 0 ? (
        <div className="ws-pagination-container">
          <button
            className="ws-page-arrow ws-page-prev"
            onClick={handlePrev}
            disabled={isPrevDisabled}
          >
            &lt;
          </button>

          <div className="ws-list">
            {currentWorkshops.map((w) => (
              <Link
                to={`/workshop/profit/ws-detail/${w.workshopId}`}
                key={w.workshopId}
                className="ws-list-link-item"
              >
                <div className="ws-item">
                  <div className="ws-item-details">
                    <div className="ws-item-profile">
                      {w.profileImg ? (
                        <img
                          src={`http://localhost:9090/upload/workshop/${w.workshopId}/${w.profileImg}`}
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
                    </div>

                    <div className="ws-item-info">
                      <div>{w.name}</div>

                      <Profit workshopId={w.workshopId} />
                      <Profit workshopId={w.workshopId} monthly={monthly} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <button
            className="ws-page-arrow ws-page-next"
            onClick={handleNext}
            disabled={isNextDisabled}
          >
            &gt;
          </button>
        </div>
      ) : (
        <p className="ws-empty">내 소유 공방이 없습니다.</p>
      )}
    </div>
  );
}

export default WorkshopProfit;
