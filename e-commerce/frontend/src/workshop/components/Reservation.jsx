import axios from "axios";
import React, { useEffect, useState } from "react";
import "../css/Reservation.css";

function Reservation({ workshopId, programId, onClose }) {
  const [reservation, setReservation] = useState([]);

  useEffect(() => {
    if (!workshopId && !programId) return;

    const dto = {
      workshopId: programId ? null : workshopId,
      programId: programId ?? null,
    };

    axios
      .get("http://localhost:9090/workshop/reservation", { params: dto })
      .then((res) => setReservation(res.data))
      .catch((err) => console.log(err));
  }, [workshopId, programId]);

  const getStatusClass = (status) => {
    switch (status) {
      case "예약완료":
        return "ws-status-complete";
      case "체험완료":
        return "ws-status-finished";
      case "예약취소":
        return "ws-status-cancelled";
      default:
        return "";
    }
  };

  return (
    <div className="ws-reservation-container">
      <h3 className="ws-rs-title">예약 현황 목록 ({reservation.length}건)</h3>

      {reservation.length > 0 ? (
        <ul className="ws-rs-list">
          {reservation.map((r) => (
            <li key={r.reservationId} className="ws-rs-list-item">
              <div className="ws-rs-item-main-info">
                <span className="ws-rs-name">
                  <strong>
                    {r.name} ({r.phone})
                  </strong>
                </span>
                <span className={`ws-rs-status ${getStatusClass(r.status)}`}>
                  {r.status}
                </span>
              </div>
              <div className="ws-rs-item-sub-info">
                <span>
                  ({r.title} | {r.startTime} ~ {r.endTime})
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="ws-rs-empty-message">예약이 없습니다.</p>
      )}
    </div>
  );
}

export default Reservation;
