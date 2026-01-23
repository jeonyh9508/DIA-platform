import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../App";
import Modal from "../../../components/UserModal";
import Login from "../../../common/Login";
import Register from "../../../common/Register";
import FindPassword from "../../../common/FindPassword";
import NotificationPopup from "../Header/NotificationPopup";
import styles from "../../css/HeaderMenu.module.css";
import axios from "axios";

function HeaderMenu() {
  const { user, loading, logout } = useAuth();
  const [modal, setModal] = useState(false);
  const [modalType, setModalType] = useState("login");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const userId = user?.userId;

  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      return;
    }

    const fetchNotifications = () => {
      axios
        .get(
          `http://localhost:9090/customer/notification-popup?userId=${userId}`
        )
        .then((res) => {
          setNotifications(res.data);
        });
    };

    fetchNotifications();

    const handleUpdate = () => fetchNotifications();
    window.addEventListener("notificationUpdated", handleUpdate);

    return () => {
      window.removeEventListener("notificationUpdated", handleUpdate);
    };
  }, [userId]);

  const showLogin = () => setModalType("login");
  const showRegister = () => setModalType("register");
  const showFindPwd = () => setModalType("findPwd");
  const findPwdPage = false;

  const openModal = () => {
    setModalType("login");
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="header-right">
      <div className="user-icons">
        <div className="notification-wrapper">
          <button
            className="icon-button notification-btn"
            onClick={() => setNotificationOpen(!notificationOpen)}
          >
            🔔
            {user && notifications.filter((n) => !n.viewed).length > 0 && (
              <span className="noti-badge">
                {notifications.filter((n) => !n.viewed).length}
              </span>
            )}
          </button>

          {notificationOpen && (
            <div>
              <div
                className="notification-overlay"
                onClick={() => setNotificationOpen(false)}
              />

              <NotificationPopup
                notifications={notifications}
                setNotifications={setNotifications}
                onClose={() => setNotificationOpen(false)}
              />
            </div>
          )}
        </div>

        <Link
          to="/customer/mypage"
          className="icon-button"
          onClick={scrollToTop}
        >
          👤
        </Link>
        {loading ? null : user ? (
          <input
            className={styles.logInOutBtn}
            type="button"
            value="로그아웃"
            onClick={logout}
          />
        ) : (
          <input
            className={styles.logInOutBtn}
            type="button"
            value="로그인"
            onClick={openModal}
          />
        )}
      </div>

      <Modal
        children="login"
        isOpen={modal}
        type={modalType}
        onClose={closeModal}
      >
        {modalType === "login" && (
          <Login
            onLoginSuccess={closeModal}
            onRegister={showRegister}
            onFindPwd={showFindPwd}
          />
        )}

        {modalType === "register" && (
          <Register onRegisterSuccess={closeModal} onLogin={showLogin} />
        )}

        {modalType === "findPwd" && (
          <FindPassword
            onPasswordChanged={closeModal}
            onLogin={showLogin}
            findPwdPage={findPwdPage}
          />
        )}
      </Modal>
    </div>
  );
}
export default HeaderMenu;
