import React, { useState } from "react";
import "./css/ErpHeader.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../App";

import TopButton from "../customer/components/TopButton";

function ErpHeader({ userId }) {
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  const handleMenuClick = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  return (
    <header className="erp-sys-header">
      <div
        className="erp-sys-logo"
        onClick={() => {
          navigate("/erp-system");
        }}
      >
        <img src="http://localhost:9090/upload/logo/erp_logo.png" width={140}/>
      </div>
      <div>
        <nav className="erp-sys-main-nav">
          <ul className="erp-sys-nav-menu">
            <li
              className={`erp-sys-nav-item ${
                openMenu === "공지사항" ? "open" : ""
              }`}
            >
              <span
                className="erp-sys-nav-link"
                onClick={() => {
                  handleMenuClick("공지사항");
                  navigate("/erp-system/notice");
                }}
              >
                공지사항
              </span>
            </li>
            <li
              className={`erp-sys-nav-item ${
                openMenu === "관리자 관리" ? "open" : ""
              }`}
            >
              <span
                className="erp-sys-nav-link"
                onClick={() => handleMenuClick("관리자 관리")}
              >
                관리자 관리
              </span>
              <ul className="erp-sys-dropdown-menu">
                <li>
                  <span
                    className="erp-sys-dropdown-link"
                    onClick={() => {
                      handleMenuClick("관리자 관리");
                      navigate("/erp-system/admin/register");
                    }}
                  >
                    관리자 등록
                  </span>
                </li>
                <li>
                  <span
                    className="erp-sys-dropdown-link"
                    onClick={() => {
                      setOpenMenu(null);
                      navigate("/erp-system/admin/action-log");
                    }}
                  >
                    관리자 활동 로그
                  </span>
                </li>
              </ul>
            </li>
            <li
              className={`erp-sys-nav-item ${
                openMenu === "승인 관리" ? "open" : ""
              }`}
            >
              <span
                className="erp-sys-nav-link"
                onClick={() => handleMenuClick("승인 관리")}
              >
                승인 관리
              </span>
              <ul className="erp-sys-dropdown-menu">
                <li>
                  <span
                    className="erp-sys-dropdown-link"
                    onClick={() => {
                      navigate("/erp-system/approval/workshop");
                      setOpenMenu(null);
                    }}
                  >
                    공방 승인 목록
                  </span>
                </li>
                <li>
                  <span
                    className="erp-sys-dropdown-link"
                    onClick={() => {
                      navigate("/erp-system/approval/program");
                      setOpenMenu(null);
                    }}
                  >
                    프로그램 승인 목록
                  </span>
                </li>
                <li>
                  <span
                    className="erp-sys-dropdown-link"
                    onClick={() => {
                      navigate("/erp-system/admin/approval-log");
                      setOpenMenu(null);
                    }}
                  >
                    승인 내역 로그
                  </span>
                </li>
              </ul>
            </li>
            <li
              className={`erp-sys-nav-item ${
                openMenu === "정산 관리" ? "open" : ""
              }`}
            >
              <span
                className="erp-sys-nav-link"
                onClick={() => handleMenuClick("정산 관리")}
              >
                정산 관리
              </span>
              <ul className="erp-sys-dropdown-menu">
                <li>
                  <span
                    className="erp-sys-dropdown-link"
                    onClick={() => {
                      navigate("/erp-system/settlement/dashboard");
                      setOpenMenu(null);
                    }}
                  >
                    정산 내역 현황
                  </span>
                </li>
                <li>
                  <span
                    className="erp-sys-dropdown-link"
                    onClick={() => {
                      navigate("/erp-system/settlement/list");
                      setOpenMenu(null);
                    }}
                  >
                    정산 처리
                  </span>
                </li>
              </ul>
            </li>

            <li
              className={`erp-sys-nav-item ${
                openMenu === "배너 관리" ? "open" : ""
              }`}
            >
              <span
                className="erp-sys-nav-link"
                onClick={() => {
                  handleMenuClick("배너 관리");
                  navigate("/erp-system/banner");
                }}
              >
                배너 관리
              </span>
            </li>

            <li
              className={`erp-sys-nav-item ${
                openMenu === "문의 관리" ? "open" : ""
              }`}
            >
              <span
                className="erp-sys-nav-link"
                onClick={() => {
                  handleMenuClick("문의 관리");
                  navigate("/erp-system/qna-admin");
                }}
              >
                문의 관리
              </span>
            </li>
          </ul>
        </nav>
      </div>
      <div className="erp-sys-login-user">
        <div className="erp-sys-login-info">
          {user?.name} 님{/* 'user?.불러올값'으로 정보 호출 */}
        </div>

        <div className="submit-btn" type="button" onClick={logout}>
          로그아웃
        </div>
      </div>
      <TopButton />
    </header>
  );
}

export default ErpHeader;
