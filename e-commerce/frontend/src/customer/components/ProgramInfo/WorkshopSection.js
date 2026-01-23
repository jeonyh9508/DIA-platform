import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import "../../css/WorkshopSection.css";

const WorkshopSection = forwardRef(({ workshop }, ref) => {
  return (
    <section ref={ref} className="section">
      <div className="info-menu">공방 소개</div>

      <div className="workshop-profile">
        <Link to={`/customer/workshop/${workshop.workshopId}`} className="link">
          <div
            className={`profile-img ${
              workshop.profileImg == null ? "no-image" : ""
            }`}
          >
            {workshop.profileImg != null ? (
              <img
                src={`http://localhost:9090/upload/workshop/${workshop.workshopId}/${workshop.profileImg}`}
                alt="워크샵 이미지"
              />
            ) : (
              <p>이미지 없음</p>
            )}
          </div>
        </Link>
        <Link to={`/customer/workshop/${workshop.workshopId}`} className="link">
          <div className="workshop-name">{workshop.name}</div>
        </Link>
      </div>

      <div className="info-desc">{workshop.description}</div>
    </section>
  );
});

export default WorkshopSection;
