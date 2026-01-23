import React, { useEffect, useRef, useState } from "react";

function SliderButton({
  handleScrollLeft,
  handleScrollRight,
  canScrollLeft,
  canScrollRight,
}) {
  return (
    <div className="arrow-buttons">
      <button
        className="arrow-button left"
        onClick={handleScrollLeft}
        disabled={!canScrollLeft}
      >
        <i className="fi fi-rr-angle-left"></i>
      </button>
      <button
        className="arrow-button right"
        onClick={handleScrollRight}
        disabled={!canScrollRight}
      >
        <i className="fi fi-rr-angle-right"></i>
      </button>
    </div>
  );
}
export default SliderButton;
