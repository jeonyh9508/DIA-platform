import React from "react";
import WorkshopAllFollowButton from "./WorkshopAllFollowButton";
import WorkshopAllTags from "./WorkshopAllTags";

function WorkshopSlideInfo({ userId, workshop, categories }) {
  return (
    <div className="workshop-slide-info">
      <p className="workshop-slide-name">{workshop.name}</p>
      <WorkshopAllFollowButton userId={userId} workshop={workshop} />
      <span className="workshop-card-location">📍{workshop.address}</span>
      <WorkshopAllTags categories={categories} workshop={workshop} />
    </div>
  );
}
export default WorkshopSlideInfo;
