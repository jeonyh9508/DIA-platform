import React from "react";

function WorkshopCard({ workshop, following, totalFollows, clickFollowBtn }) {
  return (
    <div className="workshop-info">
      <div className="workshop-card">
        <div className="workshop-name">{workshop.name}</div>

        <div className="card-stats">
          <span className="card-rating">
            ⭐ {workshop.averageRating?.toFixed(1)}
          </span>
          <span className="card-likes">❤️ {totalFollows}</span>
        </div>

        <div className="profile-info">
          <div className="profile-card">
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

            <button
              className={`follow-btn ${following ? "following" : ""}`}
              onClick={clickFollowBtn}
            >
              {following ? "팔로잉" : "+ 팔로우"}
            </button>
          </div>

          <div className="info-card">
            <div className="info-grid">
              <div className="label">대표 번호</div>
              <div className="value">{workshop.contactNumber}</div>

              <div className="label">공방 위치</div>
              <div className="value">{workshop.address}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkshopCard;
