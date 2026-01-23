import axios from "axios";
import { Checkbox } from "@mui/material";
import React, { useEffect, useState } from "react";
import WsModal from "./WsModal";
import "../css/Report.css";

function OwnerNotification({ ownerId }) {
  const [myNotifications, setMyNotifications] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const size = 10;

  useEffect(() => {
    setSelectedIds([]);
    setCurrentPage(1);
  }, [filter]);

  useEffect(() => {
    axios
      .get("http://localhost:9090/customer/my-notification", {
        params: {
          userId: ownerId,
          page: currentPage,
          size: size,
          filter: filter,
        },
      })
      .then((res) => {
        setMyNotifications(res.data.content);
        setTotalPages(res.data.totalPages);
        setSelectedIds([]); // 페이지 변경 시 선택 초기화
      })
      .catch((err) => console.error("프로그램 정보 불러오기 오류:", err));
  }, [ownerId, currentPage, filter]);

  if (!myNotifications) return <p>로딩 중...</p>;
  const openModal = (id) => {
    axios
      .get(`http://localhost:9090/customer/my-notification-info?id=${id}`)
      .then((res) => {
        setNotification(res.data);
        console.log(res.data);
        setIsModalOpen(true);
      })
      .catch((err) => console.error("알림 상세 불러오기 오류:", err));
  };

  const closeModal = () => {
    if (notification && !notification.viewed) {
      axios
        .post(
          `http://localhost:9090/customer/notification/update-notification?id=${notification.id}`
        )
        .then(() =>
          setMyNotifications((prev) =>
            prev.map((n) =>
              n.id === notification.id ? { ...n, viewed: true } : n
            )
          )
        )
        .catch((err) => console.error("읽음 처리 오류:", err));
    }
    setIsModalOpen(false);
    setNotification(null);
  };

  const clickCheckbox = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === myNotifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(myNotifications.map((n) => n.id));
    }
  };

  const updateViewed = () => {
    if (selectedIds.length === 0) {
      alert("선택된 알림이 없습니다.");
      return;
    }

    axios
      .post(
        "http://localhost:9090/customer/notification/update-notifications",
        selectedIds
      )
      .then(() =>
        setMyNotifications((prev) =>
          prev.map((n) =>
            selectedIds.includes(n.id) ? { ...n, viewed: true } : n
          )
        )
      )
      .finally(() => setSelectedIds([]))
      .catch((err) => {
        console.error("읽음 처리 오류:", err);
        alert("읽음 처리 중 오류가 발생했습니다.");
      });
  };

  const deleteSelected = () => {
    if (selectedIds.length === 0) {
      alert("선택된 알림이 없습니다.");
      return;
    }

    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    axios
      .post(
        "http://localhost:9090/customer/notification/delete-notifications",
        selectedIds
      )
      .then((res) =>
        setMyNotifications((prev) =>
          prev.filter((n) => !selectedIds.includes(n.id))
        )
      )
      .finally(() => setSelectedIds([]))
      .catch((err) => {
        console.error("삭제 오류:", err);
        alert("삭제 중 오류가 발생했습니다.");
      });
  };

  return (
    <div className="ws-report-container">
      <div className="ws-on-btn-bar">
        <div className="notification-tabs">
          <button
            className={filter === "all" ? "tab active" : "tab"}
            onClick={() => setFilter("all")}
          >
            전체
          </button>

          <button
            className={filter === "read" ? "tab active" : "tab"}
            onClick={() => setFilter("read")}
          >
            읽음
          </button>

          <button
            className={filter === "unread" ? "tab active" : "tab"}
            onClick={() => setFilter("unread")}
          >
            안 읽음
          </button>
        </div>

        <div className="ws-on-btn-set">
          <button
            type="button"
            className="ws-view-button"
            onClick={updateViewed}
          >
            읽음 처리
          </button>
          <button
            type="button"
            className="ws-view-button ws-delete-btn"
            onClick={deleteSelected}
          >
            선택 삭제
          </button>
        </div>
      </div>
      <div className="ws-table-wrapper">
        <table className="ws-qna-table ws-notification-table">
          <thead>
            <tr>
              <th>
                {" "}
                <span>
                  <Checkbox
                    checked={
                      myNotifications.length > 0 &&
                      selectedIds.length === myNotifications.length
                    }
                    onChange={selectAll}
                  />
                </span>
              </th>
              <th>내용</th>
              <th>발신자</th>
              <th>상태</th>
              <th>발송 시간</th>
              <th>비고</th>
            </tr>
          </thead>
          <tbody>
            {myNotifications.length === 0 ? (
              <tr>
                <td colSpan="6">수신된 알림이 없습니다.</td>
              </tr>
            ) : (
              myNotifications.map((n) => (
                <tr key={n.id}>
                  <td>
                    <Checkbox
                      checked={selectedIds.includes(n.id)}
                      onChange={() => clickCheckbox(n.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td
                    className={`ws-on-message-cell ${
                      n.viewed ? "" : "ws-on-message-unread"
                    }`}
                    onClick={() => openModal(n.id)}
                  >
                    {n.message}
                  </td>
                  <td>{n.workshopName ? n.workshopName : n.name}</td>
                  <td
                    className={
                      n.viewed
                        ? "ws-qna-status-completed"
                        : "ws-qna-status-pending"
                    }
                  >
                    {n.viewed ? "읽음" : "안읽음"}
                  </td>
                  <td>{n.createdAt}</td>
                  <td>
                    <button
                      type="button"
                      className="ws-view-button"
                      onClick={() => openModal(n.id)}
                    >
                      보기
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          ◀
        </button>

        {/* 페이지 버튼 5개씩 그룹 */}
        {(() => {
          const groupSize = 5;
          const groupStart =
            Math.floor((currentPage - 1) / groupSize) * groupSize + 1;
          const groupEnd = Math.min(groupStart + groupSize - 1, totalPages);

          const pages = [];
          for (let p = groupStart; p <= groupEnd; p++) {
            pages.push(
              <button
                key={p}
                className={currentPage === p ? "active" : ""}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </button>
            );
          }
          return pages;
        })()}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          ▶
        </button>
      </div>
      <WsModal
        isActive={isModalOpen}
        onClose={closeModal}
        type="notification"
        data={notification}
      />
    </div>
  );
}

export default OwnerNotification;
