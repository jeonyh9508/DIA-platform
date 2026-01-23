import React, { useState } from "react";

function SaveStatus({ saveStatus }) {
  return (
    <div className="save-status">
      {saveStatus === "saving" && (
        <span>
          <i className="fi fi-sr-refresh"> </i> 자동 저장 중...
        </span>
      )}
      {saveStatus === "saved" && (
        <span>
          <i className="fi fi-sr-check"></i> 자동 저장 완료
        </span>
      )}
      {saveStatus === "error" && <span>⚠ 저장 실패</span>}
    </div>
  );
}
export default SaveStatus;
