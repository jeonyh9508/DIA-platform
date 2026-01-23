import React from "react";

function ProgramInfo({ reservation }) {
  return (
    <div className="info-box">
      <div className="info-title">프로그램 정보</div>
      <div className="program-box">
        <div
          className={`program-thumb ${
            reservation.thumb == null ? "no-image" : ""
          }`}
        >
          {reservation.thumb != null ? (
            <img
              src={`http://localhost:9090/upload/workshop/${reservation.workshopId}/program/${reservation.programId}/${reservation.thumb}`}
              alt="프로그램 썸네일"
            />
          ) : (
            <p>이미지 없음</p>
          )}
        </div>

        <div className="info-grid">
          <div className="label">프로그램명</div>
          <div className="value">{reservation.title}</div>

          <div className="label">수업일</div>
          <div className="value">{reservation.scheduleDay}</div>

          <div className="label">진행 시간</div>
          <div className="value">{reservation.scheduleTime}</div>

          <div className="label">장소</div>
          <div className="value">{reservation.address}</div>
        </div>
      </div>
    </div>
  );
}

export default ProgramInfo;
