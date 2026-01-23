// src/components/Header.js

import React, { useState } from "react";
import { Link } from "react-router-dom";
import WsModal from "./WsModal";
import "../css/OwnerController.css";

function OwnerController({
  programId,
  programTitle,
  workshopId,
  userId,
  data,
}) {
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [programModalOpen, setProgramModalOpen] = useState(false);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [wishModalOpen, setWishModalOpen] = useState(false);

  return (
    <div className="ws-costom-font">
      {" "}
      <div className="ws-owner-controll">
        <button type="button" onClick={() => setProgramModalOpen(true)}>
          프로그램 수정
        </button>
        <button type="button" onClick={() => setScheduleModalOpen(true)}>
          스케줄 관리
        </button>
        <button type="button" onClick={() => setReservationModalOpen(true)}>
          예약 현황
        </button>
        <button type="button" onClick={() => setWishModalOpen(true)}>
          위시 리스트
        </button>
        <Link to="/workshop">홈으로</Link>
      </div>
      <WsModal
        isActive={scheduleModalOpen}
        type="scheduleManage"
        onClose={() => {
          setScheduleModalOpen(false);
          data();
        }}
        userId={userId}
        id={programId}
      />
      <WsModal
        isActive={programModalOpen}
        type="programModi"
        data={data}
        onClose={() => setProgramModalOpen(false)}
        id={programId}
        workshopId={workshopId}
      />
      <WsModal
        isActive={reservationModalOpen}
        type="reservation"
        onClose={() => setReservationModalOpen(false)}
        id={programId}
        workshopId={workshopId}
      />
      <WsModal
        isActive={wishModalOpen}
        type="wishList"
        programTitle={programTitle}
        onClose={() => setWishModalOpen(false)}
        id={programId}
        workshopId={workshopId}
      />
    </div>
  );
}

export default OwnerController;
