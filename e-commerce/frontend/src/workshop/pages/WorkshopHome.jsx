import React, { useEffect, useState } from "react";
import WorkshopList from "../components/WorkshopList";
import MyInfo from "../components/MyInfo";
import WorkshopProfit from "../components/WorkshopProfit";
import "../css/WsHome.css";
import OwnerNotification from "../components/OwnerNotification";
import WsModal from "../components/WsModal";

function WorkshopHome({ ownerId, role, name, monthly }) {
  const [activeTab, setActiveTab] = useState(() => {
    return window.location.hash.replace("#", "") || "workshop";
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) setActiveTab(hash);
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const chageTab = (tab) => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  return (
    <div>
      <div className="ws-title-header">
        <h1 className="ws-title">{name} 님의 공방</h1>
      </div>
      <div className="ws-tab">
        <button
          className={
            activeTab === "workshop" ? "ws-button active" : "ws-button"
          }
          onClick={() => chageTab("workshop")}
        >
          내 공방 관리
        </button>

        <button
          className={
            activeTab === "settlement" ? "ws-button active" : "ws-button"
          }
          onClick={() => chageTab("settlement")}
        >
          정산 내역
        </button>
        <button
          className={
            activeTab === "owner-noti" ? "ws-button active" : "ws-button"
          }
          onClick={() => chageTab("owner-noti")}
        >
          알림
        </button>
        <button
          className={activeTab === "myinfo" ? "ws-button active" : "ws-button"}
          onClick={() => chageTab("myinfo")}
        >
          내 정보
        </button>
      </div>
      <div className="ws-main">
        {activeTab === "workshop" && (
          <div className="ws-content">
            <WorkshopList ownerId={ownerId} role={role} />
          </div>
        )}
        {activeTab === "settlement" && (
          <div className="ws-content">
            <WorkshopProfit ownerId={ownerId} monthly={monthly} />
          </div>
        )}
        {activeTab === "owner-noti" && (
          <div className="ws-content">
            <OwnerNotification ownerId={ownerId} role={role} />
          </div>
        )}
        {activeTab === "myinfo" && (
          <div className="ws-content">
            <MyInfo ownerId={ownerId} role={role} />
          </div>
        )}
        <button
          className="ws-qna-admin-btn"
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          <img
            src="http://localhost:9090/upload/btn/qna_btn.png"
            alt="관리자문의"
          />
        </button>
      </div>
      <WsModal
        id={ownerId}
        isActive={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="qnaAdmin"
      />
    </div>
  );
}

export default WorkshopHome;
