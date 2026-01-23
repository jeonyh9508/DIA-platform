import React from "react";
import { Link } from "react-router-dom";
import "../css/WsHeader.css";
import { useAuth } from "../../App";

function WsHeader({ ownerId }) {
  const { user, logout, loading } = useAuth();
  if (loading) return;
  if (!user) return;

  return (
    <header className="ws-main-header">
      <div className="logo-section">
        <Link to="/workshop" className="logo">
          <img
            src="http://localhost:9090/upload/logo/dia_logo.png"
            alt="로고"
          />
        </Link>
      </div>

      <div className="user-actions">
        <span className="user-greeting">{user?.name} 님</span>
        <button className="logout-button" onClick={logout}>
          <img
            src="http://localhost:9090/upload/btn/logout_btn.png"
            alt="로그아웃"
          />
        </button>
      </div>
    </header>
  );
}

export default WsHeader;
