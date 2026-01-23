import React from "react";
function WorkshopAllSlideLogo({ workshop }) {
  return (
    <div className="workshop-slide-logo">
      {workshop.profileImg != null ? (
        <img
          src={`http://localhost:9090/upload/workshop/${workshop.workshopId}/${workshop.profileImg}`}
          alt="워크샵 이미지"
        />
      ) : (
        <p>이미지 없음</p>
      )}
    </div>
  );
}
export default WorkshopAllSlideLogo;
