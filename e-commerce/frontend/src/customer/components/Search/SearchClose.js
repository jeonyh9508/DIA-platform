import React from "react";
import "../../css/Header.css";

export default function SearchClose({ onClose }) {
  return (
    <div>
      <div className="hr">
        <hr color="#ddd" />
      </div>

      <div className="search-field-close">
        <input
          type="button"
          className="close-button"
          onClick={onClose}
          value="닫기"
        />
      </div>
    </div>
  );
}
