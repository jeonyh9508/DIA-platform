import React, { useEffect, useState } from "react";
import "../css/Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer-all">
      <div className="footer">
        <h3>2025 DIA PROJECT | CLASS</h3>
        <div className="footer-a">
          <Link to="/">HOME</Link>
          <Link to="/workshop">WORKSHOP</Link>
          <Link to="/erp-system/login">ERP</Link>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
