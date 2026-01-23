import React from "react";

function UserInfo({ userInfo }) {
  return (
    <div className="info-box">
      <div className="info-title">예약자 정보</div>
      <div className="user-info">
        <div className="info-grid">
          <div className="label">이메일</div>
          <div className="value">{userInfo.email}</div>

          <div className="label">이름</div>
          <div className="value">{userInfo.name}</div>

          <div className="label">연락처</div>
          <div className="value">{userInfo.phone}</div>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
