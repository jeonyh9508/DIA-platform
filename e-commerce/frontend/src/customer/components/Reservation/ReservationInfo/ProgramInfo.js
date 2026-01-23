import React from "react";

function ProgramInfo({ scheduleInfo }) {
  return (
    <div className="info-box">
      <div className="info-title">프로그램 정보</div>
      <div className="program-box">
        <div
          className={`program-thumb ${
            scheduleInfo.thumb == null ? "no-image" : ""
          }`}
        >
          {scheduleInfo.thumb != null ? (
            <img
              src={`http://localhost:9090/upload/workshop/${scheduleInfo.workshopId}/program/${scheduleInfo.programId}/${scheduleInfo.thumb}`}
              alt="프로그램 썸네일"
            />
          ) : (
            <p>이미지 없음</p>
          )}
        </div>
        <div className="info-grid">
          <div className="label">프로그램명</div>
          <div className="value">{scheduleInfo.title}</div>

          <div className="label">일시</div>
          <div className="value">{scheduleInfo.scheduleDate}</div>

          <div className="label">장소</div>
          <div className="value">{scheduleInfo.address}</div>
        </div>
      </div>
    </div>
  );
}

export default ProgramInfo;
