import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import Header from "../components/Header";
import "../css/MyPage.css";
import Modal from "../components/Modal";
import Footer from "../components/Footer";
import { useAuth } from "../../App";
import FileUpload from "../../workshop/components/FileUpload";
import { toast } from "react-toastify";
import axios from "axios";

function MyPage({ userId }) {
  const { user, loading, login, logout } = useAuth();
  const [thumb, setThumb] = useState(null);
  const [isImageDeleted, setIsImageDeleted] = useState(false);
  const navigate = useNavigate();
  const [tempUser, setTempUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      toast.error("로그인이 필요합니다.");
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (!user) return null;

  const openModal = () => {
    if (user) {
      setTempUser({ ...user });
      setIsModalOpen(true);
    }
  };
  const closeModal = () => {
    // 모달 닫을 때 임시 상태 초기화
    setIsModalOpen(false);
    setTempUser(null);
    setThumb(null);
    setIsImageDeleted(false);
  };

  const handleFileChange = (file) => {
    setThumb(file);

    if (file === null) {
      setIsImageDeleted(true);
    } else {
      setIsImageDeleted(false);
    }
  };

  const tempChange = (e) => {
    const { name, value } = e.target;
    setTempUser((prevTempUser) => ({
      ...prevTempUser,
      [name]: value,
    }));
  };

  // 메뉴 아이템 데이터
  const menuItems = [
    { name: "위시리스트", icon: "❤️", link: `/customer/my-wish` },
    { name: "팔로우 목록", icon: "🙌", link: "/customer/my-follow" },
    { name: "결제 및 예약 내역", icon: "💰", link: "/customer/my-reservation" },
    { name: "수강한 프로그램", icon: "✅", link: "/customer/my-program" },
    { name: "알림함", icon: "🔔", link: "/customer/my-notification" },
    { name: "문의 내역 관리", icon: "💬", link: "/customer/my-qna" },
    { name: "리뷰 관리", icon: "✍️", link: "/customer/my-review" },
  ];

  // 밀리초 yyyy-MM-dd'T'HH:mm:ss 형태로 변환
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const userTimestamp = user?.createdAt;
  const userCreatedAt = formatTimestamp(userTimestamp);

  function userModify(e) {
    e.preventDefault();

    let { name, email, phone, password } = tempUser;

    if (!name) return alert("이름 입력해주세요.");
    if (!phone) return alert("본인의 연락처를 입력해주세요.");
    if (!email) return alert("이메일을 입력해주세요.");

    const myData = {
      userId: userId,
      name: name,
      phone: phone,
      email: email,
      password: password,
    };

    const formData = new FormData();

    formData.append(
      "myData",
      new Blob([JSON.stringify(myData)], { type: "application/json" })
    );

    if (thumb) {
      formData.append("profileImageFile", thumb);
    }
    formData.append("isImageDeleted", isImageDeleted);

    api
      .post("/customer/mypage", formData, {
        headers: {
          "Content-Type": undefined,
        },
      })
      .then((res) => {
        console.log("서버 응답값(res.data):", res.data);

        toast("수정 완료!");
        const newFileName = res.data;

        let updatedProfileImg = user.profileImg;

        if (thumb) {
          updatedProfileImg = newFileName;
        } else if (isImageDeleted) {
          updatedProfileImg = null;
        }

        const updatedUser = {
          ...user,
          name: name,
          email: email,
          phone: phone,
          profileImg: updatedProfileImg,
        };

        login(updatedUser);

        closeModal(); // 모달 닫기
      })
      .catch((err) => {
        console.error("수정 실패: ", err);
        toast(err.response?.data || "수정 중 오류가 발생했습니다.");
      });
  }

  function quit() {
    if (!window.confirm("정말로 탈퇴하시겠습니까?")) {
      return;
    }
    axios
      .post(`http://localhost:9090/workshop/owner-quit?ownerId=${userId}`)
      .then((res) => {
        alert("탈퇴 처리되었습니다.");
        logout();
        navigate(`/`);
      })
      .catch((err) => console.error("회원 탈퇴 실패:", err));
  }

  const existingImageUrl =
    user && user.profileImg
      ? `http://localhost:9090/upload/user/${userId}/${
          user.profileImg
        }?t=${Date.now()}`
      : `http://localhost:9090/upload/user/default_img.jpg`;

  return (
    <div className="my-page">
      <Header />

      <main className="mypage-container">
        <nav className="breadcrumb">
          <span>마이페이지 &gt; 프로필</span>
        </nav>

        <h2 className="page-title">프로필</h2>

        {/* === 프로필 요약 섹션 === */}
        <section className="profile-summary">
          {user.profileImg == null ? (
            <img
              src={`http://localhost:9090/upload/user/default_img.jpg`}
              alt="프로필 이미지"
              className="user-profile"
            />
          ) : (
            <img
              src={existingImageUrl}
              alt="프로필 이미지"
              className="user-profile"
            />
          )}
          <div className="profile-details">
            <div className="detail-item">
              <span className="detail-name">이름</span>
              <span className="detail-value">{user.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">이메일</span>
              <span className="detail-value">{user.email}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">연락처</span>
              <span className="detail-value">{user.phone}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">가입일</span>
              <span className="detail-value">{userCreatedAt}</span>
            </div>
          </div>
        </section>

        {/* === 메뉴 그리드 섹션 === */}
        <section className="menu-grid">
          {menuItems.map((item) => (
            <Link to={item.link} key={item.name} className="menu-item">
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-text">{item.name}</span>
            </Link>
          ))}
          {/* 빈 아이템으로 그리드 채우기 */}
          <div className="menu-item-placeholder"></div>
          <div className="menu-item-placeholder"></div>
        </section>

        {/* === 회원 정보 수정/탈퇴 버튼 === */}
        <section className="action-buttons">
          <button className="edit-button" onClick={openModal}>
            회원 정보 수정
          </button>
          <button className="delete-button" onClick={quit}>
            회원 탈퇴
          </button>
        </section>
      </main>
      {tempUser && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          {/* 전체 컨테이너 클래스 변경 */}
          <div className="MemberEditModal__Container">
            {/* 제목 클래스 추가 */}
            <h3 className="MemberEditModal__Title">회원 정보 수정</h3>

            <form onSubmit={userModify}>
              {/* 1. 프로필 이미지 섹션 */}
              <div className="MemberEditModal__AvatarSection">
                {/* FileUpload를 감싸는 래퍼 클래스 변경 */}
                <div className="MemberEditModal__ImageWrapper">
                  <FileUpload
                    type="single"
                    name="profileImg"
                    onChange={handleFileChange}
                    initialPreviewUrl={existingImageUrl}
                  />
                </div>
              </div>

              {/* 2. 입력 폼 섹션 */}
              <div className="MemberEditModal__FormSection">
                {/* 이름 입력 */}
                <div className="MemberEditModal__InputGroup">
                  <span className="MemberEditModal__Label">이름</span>
                  <span className="MemberEditModal__InputWrapper">
                    <input
                      className="MemberEditModal__Input"
                      placeholder="영문/한글로 최소 2글자 이상 입력해주세요"
                      name="name"
                      value={tempUser.name || ""}
                      onChange={tempChange}
                    />
                  </span>
                </div>

                {/* 연락처 입력 */}
                <div className="MemberEditModal__InputGroup">
                  <span className="MemberEditModal__Label">연락처</span>
                  <span className="MemberEditModal__InputWrapper">
                    <input
                      className="MemberEditModal__Input"
                      placeholder='"-" 없이 숫자만'
                      name="phone"
                      value={tempUser.phone || ""}
                      onChange={tempChange}
                    />
                  </span>
                </div>

                {/* 이메일 입력 */}
                <div className="MemberEditModal__InputGroup">
                  <span className="MemberEditModal__Label">이메일</span>
                  <span className="MemberEditModal__InputWrapper">
                    <input
                      className="MemberEditModal__Input"
                      placeholder="example@domain.com"
                      name="email"
                      value={tempUser.email || ""}
                      onChange={tempChange}
                    />
                  </span>
                </div>

                {/* 비밀번호 입력 */}
                <div className="MemberEditModal__InputGroup">
                  <span className="MemberEditModal__Label">비밀번호</span>
                  <span className="MemberEditModal__InputWrapper">
                    <input
                      className="MemberEditModal__Input"
                      type="password"
                      name="password"
                      onChange={tempChange}
                      placeholder="현재 사용 중인 비밀번호"
                    />
                  </span>
                </div>

                {/* 버튼 섹션 */}
                <section className="MemberEditModal__ButtonSection">
                  <button
                    type="submit"
                    className="MemberEditModal__SubmitButton"
                  >
                    수정 완료
                  </button>
                </section>
              </div>
            </form>
          </div>
        </Modal>
      )}
      <Footer />
    </div>
  );
}

export default MyPage;
