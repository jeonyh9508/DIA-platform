import React from "react";
import { Link } from "react-router-dom";
import HeaderMenu from "../Header/HeaderMenu";

function SearchHeader() {
  return (
    <header className="main-header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="header-title">
            <img
              src="http://localhost:9090/upload/logo/dia_logo.png"
              alt="로고"
            />
          </Link>
        </div>
        <HeaderMenu />
      </div>
    </header>
  );
}
export default SearchHeader;
