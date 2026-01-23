import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import WsModal from "./WsModal";
import "../css/WsList.css";
import { toast } from "react-toastify";

function WorkshopList({ ownerId }) {
  const [workshops, setWorkshops] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workshopId, setWorkshopId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [notice, setNotice] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 6;
  const [currentTab, setCurrentTab] = useState("전체");
  const [rejectModal, setRejectModal] = useState(false);

  useEffect(() => {
    if (!ownerId) return;
    axios
      .get("http://localhost:9090/workshop/home", {
        params: { ownerId: ownerId },
      })
      .then((res) => {
        setWorkshops(res.data);
        res.data.forEach((w) => {
          axios
            .get("http://localhost:9090/workshop/notification", {
              params: { workshopId: w.workshopId },
            })
            .then((res2) => {
              setNotice((prev) => ({ ...prev, [w.workshopId]: res2.data }));
            })
            .catch(console.log);
        });
      })
      .catch((err) => console.error("공방 목록 불러오기 오류:", err));
  }, [ownerId]);

  const toggleMenu = (id, approved) => {
    if (approved === "대기") {
      toast.error("승인 후 이용 가능합니다");
      return;
    }
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const hasUnread = (workshopId) => notice[workshopId]?.some((n) => !n.viewed);

  const readMark = (notificationId, workshopId) => {
    axios
      .post("http://localhost:9090/workshop/notification/read", {
        notificationId,
      })
      .then(() => {
        setNotice((prev) => ({
          ...prev,
          [workshopId]: prev[workshopId].map((n) =>
            n.notificationId === notificationId ? { ...n, viewed: true } : n
          ),
        }));
      })
      .catch(console.log);
  };

  const handleNext = () =>
    setCurrentIndex((prevIndex) => prevIndex + itemsPerPage);
  const handlePrev = () =>
    setCurrentIndex((prevIndex) => prevIndex - itemsPerPage);

  const filteredWorkshops =
    currentTab === "전체"
      ? workshops
      : workshops.filter((w) => w.approved === currentTab);

  const currentWorkshops = filteredWorkshops.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

  const isPrevDisabled = currentIndex === 0;
  const isNextDisabled =
    currentIndex + itemsPerPage >= filteredWorkshops.length;

  return (
    <div className="ws-content-box" onClick={() => setOpenMenuId(null)}>
      <div className="ws-header-line">
        <div className="ws-tab">
          {["전체", "대기", "승인", "거절"].map((tab) => (
            <button
              key={tab}
              className={`ws-button ${currentTab === tab ? "active" : ""}`}
              onClick={() => {
                setCurrentTab(tab);
                setCurrentIndex(0); // 탭 변경 시 페이지 초기화
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        <Link to={`/workshop/add`} className="ws-list-link-add">
          공방 추가
        </Link>
      </div>

      {currentWorkshops.length > 0 ? (
        <div className="ws-pagination-container">
          <button
            className="ws-page-arrow ws-page-prev"
            onClick={handlePrev}
            disabled={isPrevDisabled}
          >
            &lt;
          </button>

          <div className="ws-list">
            {currentWorkshops.map((w) => {
              const isMenuOpen = openMenuId === w.workshopId;
              return (
                <div className="ws-item" key={w.workshopId}>
                  <div
                    className="ws-item-details"
                    onClick={(e) => {
                      toggleMenu(w.workshopId, w.approved);
                      e.stopPropagation();
                    }}
                  >
                    <div className="ws-item-profile">
                      <img
                        src={
                          w.profileImg
                            ? `http://localhost:9090/upload/workshop/${w.workshopId}/${w.profileImg}`
                            : `http://localhost:9090/upload/workshop/workshop_default.png`
                        }
                        alt="워크샵 이미지"
                        className="ws-profile-img"
                      />
                    </div>
                    <div className="ws-item-info">
                      <div>{w.name}</div>
                      {w.approved === "대기" && (
                        <span className="ws-pending">
                          승인 여부 : {w.approved}
                        </span>
                      )}
                      {w.approved === "승인" && w.active && (
                        <span
                          className={`ws-approved ${
                            w.status === "정상"
                              ? "status-normal"
                              : w.status === "휴업"
                              ? "status-closed"
                              : w.status === "숨김"
                              ? "status-hidden"
                              : ""
                          }`}
                        >
                          상태 : {w.status} / 승인 여부 : {w.approved}
                        </span>
                      )}
                      {w.approved === "승인" && !w.active && (
                        <span className="ws-approved">
                          승인 여부 : {w.approved}{" "}
                          <span className="ws-deactivate"> (비활성화)</span>
                        </span>
                      )}
                      {w.approved === "거절" && (
                        <span className="ws-rejected">
                          승인 여부 : {w.approved}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="menu-container">
                    {w.approved !== "대기" ? (
                      <button
                        className="menu-toggle"
                        onClick={(e) => {
                          toggleMenu(w.workshopId, w.approved);
                          e.stopPropagation();
                        }}
                      >
                        ⋮
                        {hasUnread(w.workshopId) && (
                          <span className="red-dot" />
                        )}
                      </button>
                    ) : (
                      <></>
                    )}
                    {w.approved === "승인" && (
                      <div
                        className={`dropdown-menu ${isMenuOpen ? "open" : ""}`}
                      >
                        <Link to={`/workshop/info/${w.workshopId}`}>
                          상세 보기
                        </Link>
                        <Link to={`/workshop/ws-modi/${w.workshopId}`}>
                          정보 수정
                        </Link>
                        <Link
                          to={`/workshop/report/view/${w.workshopId}/${w.name}`}
                        >
                          소비자 문의
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setWorkshopId(w.workshopId);
                            setIsModalOpen(true);
                            setOpenMenuId(null);
                          }}
                        >
                          알림
                          {hasUnread(w.workshopId) && (
                            <span className="red-dot" />
                          )}
                        </button>
                      </div>
                    )}
                    {w.approved === "거절" && (
                      <div
                        className={`dropdown-menu ${isMenuOpen ? "open" : ""}`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setRejectModal(true);
                            setWorkshopId(w.workshopId);
                            setOpenMenuId(null);
                          }}
                        >
                          거절 사유
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setWorkshopId(w.workshopId);
                            setIsModalOpen(true);
                            setOpenMenuId(null);
                          }}
                        >
                          알림
                          {hasUnread(w.workshopId) && (
                            <span className="red-dot" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            className="ws-page-arrow ws-page-next"
            onClick={handleNext}
            disabled={isNextDisabled}
          >
            &gt;
          </button>
        </div>
      ) : (
        <p className="ws-empty">내 소유 공방이 없습니다.</p>
      )}

      <WsModal
        isActive={isModalOpen}
        type="notice"
        id={workshopId}
        data={notice[workshopId] || []}
        readMark={readMark}
        onClose={() => setIsModalOpen(false)}
      />

      <WsModal
        isActive={rejectModal}
        type="rejectReason"
        id={workshopId}
        data="workshop"
        onClose={() => {
          setRejectModal(false);
        }}
      />
    </div>
  );
}

export default WorkshopList;
