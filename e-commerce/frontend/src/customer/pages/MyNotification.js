import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import "../css/MyNotification.css";
import { Checkbox } from "@mui/material";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import NotificationList from "../components/MyPage/MyNotification/NotificationList";
import NotificationModal from "../components/MyPage/MyNotification/NotificationModal";
import Pagination from "../../components/Pagination";

function MyNotification({ userId }) {
  const [myNotifications, setMyNotifications] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filter, setFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수

  const size = 10; // 페이지당 10개

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    setSelectedIds([]); // 탭(필터) 바뀔 때 선택 모두 해제
    setCurrentPage(1); // 필터 변경 시 항상 1페이지로 이동
  }, [filter]);

  useEffect(() => {
    if (!userId) return;

    const fetchMyNotifications = () => {
      axios
        .get("http://localhost:9090/customer/my-notification", {
          params: {
            userId,
            page: currentPage,
            size,
            filter,
          },
        })
        .then((res) => {
          setMyNotifications(res.data.content);
          setTotalPages(res.data.totalPages);
          setSelectedIds([]);
        })
        .catch((err) => console.error("알림 정보 불러오기 오류:", err));
    };

    // 처음 페이지 들어왔을 때
    fetchMyNotifications();

    const handleUpdate = () => fetchMyNotifications();
    window.addEventListener("notificationUpdated", handleUpdate);

    return () => {
      window.removeEventListener("notificationUpdated", handleUpdate);
    };
  }, [userId, currentPage, filter]);

  if (!myNotifications) return <p>로딩 중...</p>;

  const openModal = (id) => {
    axios
      .get(`http://localhost:9090/customer/my-notification-info?id=${id}`)
      .then((res) => {
        setNotification(res.data); // 데이터 저장
        setIsModalOpen(true);
      })
      .catch((err) => console.error("알림 상세 불러오기 오류:", err));
  };

  const closeModal = () => {
    if (notification && !notification.viewed) {
      axios
        .post(
          "http://localhost:9090/customer/notification/update-notification?id=" +
            notification.id
        )
        .then(() => {
          // 화면에서도 읽음 상태 업데이트
          setMyNotifications((prev) =>
            prev.map((n) =>
              n.id === notification.id ? { ...n, viewed: true } : n
            )
          );

          // 헤더 갱신 이벤트 전송
          window.dispatchEvent(new Event("notificationUpdated"));
        })
        .catch((err) => console.error("읽음 처리 오류:", err));
    }

    setIsModalOpen(false);
    setNotification(null); // 닫을 때 초기화
  };

  const clickCheckbox = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === myNotifications.length) {
      // 이미 전체 선택되어 있으면 해제
      setSelectedIds([]);
    } else {
      // 전체 선택
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
      .then((res) => {
        //alert(`${res.data}개의 알림이 읽음 처리되었습니다.`);

        // UI에서도 즉시 읽음 상태로 반영
        setMyNotifications((prev) =>
          prev.map((n) =>
            selectedIds.includes(n.id) ? { ...n, viewed: true } : n
          )
        );

        setSelectedIds([]);

        // 헤더 갱신 이벤트 전송
        window.dispatchEvent(new Event("notificationUpdated"));
      })
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

    const deleteCheck = window.confirm("정말 삭제하시겠습니까?");
    if (!deleteCheck) {
      return;
    }

    axios
      .post(
        "http://localhost:9090/customer/notification/delete-notifications",
        selectedIds
      )
      .then((res) => {
        alert(`${res.data}개의 알림이 삭제되었습니다.`);

        // UI 즉시 반영
        setMyNotifications((prev) =>
          prev.filter((n) => !selectedIds.includes(n.id))
        );
        setSelectedIds([]);

        // 헤더 갱신 이벤트 전송
        window.dispatchEvent(new Event("notificationUpdated"));
      })
      .catch((err) => {
        console.error("삭제 오류:", err);
        alert("삭제 중 오류가 발생했습니다.");
      });
  };

  return (
    <div className="my-page">
      <Header />

      <div className="mypage-container">
        <nav className="breadcrumb">
          <span>
            <Link to="http://localhost:3000/customer/mypage" className="link">
              마이페이지
            </Link>{" "}
            &gt; 알림함
          </span>
        </nav>

        <h1 className="page-title">알림함</h1>

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

        {selectedIds.length > 0 && (
          <div className="notification-action-bar">
            <span>{selectedIds.length}개 선택됨</span>

            <div className="notification-actions">
              <button className="notification-btns" onClick={updateViewed}>
                읽음
              </button>
              <button className="notification-btns" onClick={deleteSelected}>
                삭제
              </button>
            </div>
          </div>
        )}

        <div className="notification-nav">
          <span>
            <Checkbox
              checked={
                myNotifications.length > 0 &&
                selectedIds.length === myNotifications.length
              }
              onChange={selectAll}
            />
          </span>
          <span>내용</span>
          <span>발신자</span>
          <span>발송 시간</span>
        </div>

        <NotificationList
          myNotifications={myNotifications}
          selectedIds={selectedIds}
          clickCheckbox={clickCheckbox}
          openModal={openModal}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <NotificationModal
        notification={notification}
        isModalOpen={isModalOpen}
        closeModal={closeModal}
      />

      <Footer />
    </div>
  );
}

export default MyNotification;
