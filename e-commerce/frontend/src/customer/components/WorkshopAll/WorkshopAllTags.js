import React from "react";
import { Link } from "react-router-dom";
import LoadMore from "../LoadMore";

function WorkshopAllTags({ categories, workshop }) {
  return (
    <div className="workshop-slide-tags">
      {categories[workshop.workshopId]?.length ? (
        categories[workshop.workshopId].map((tag, idx) => (
          <span key={idx} className="workshop-slide-tag">
            {tag}
          </span>
        ))
      ) : (
        <span className="workshop-slide-tag">태그 없음</span>
      )}
    </div>
  );
}
export default WorkshopAllTags;
