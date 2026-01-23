import axios from "axios";
import { useAuth } from "../../App";
import { useEffect, useState } from "react";
import "../css/MyInfo.css";
import FileUpload from "./FileUpload";
import WsModal from "./WsModal";

function MyInfo({ ownerId }) {
  const { logout } = useAuth();
  const [thumb, setThumb] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState({
    userId: "",
    name: "",
    phone: "",
    email: "",
    profileImg: null,
  });

  useEffect(() => {
    if (!ownerId) return;
    axios
      .get(`http://localhost:9090/workshop/my?ownerId=${ownerId}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => console.error(err));
  }, [ownerId]);

  function modify(e) {
    e.preventDefault();
    const f = e.target;

    if (!f.name.value) return alert("이름 입력해주세요.");
    if (!f.phone.value) return alert("본인의 연락처를 입력해주세요.");
    if (!f.email.value) return alert("이메일을 입력해주세요.");

    const ownerData = {
      userId: ownerId,
      name: f.name.value,
      phone: f.phone.value,
      email: f.email.value,
    };

    const formData = new FormData();

    formData.append(
      "ownerData",
      new Blob([JSON.stringify(ownerData)], { type: "application/json" })
    );

    if (thumb) {
      formData.append("profileImageFile", thumb);
    }

    axios
      .post("http://localhost:9090/workshop/owner-modify", formData, {})
      .then((res) => {
        logout();
        alert("정보가 수정되었습니다. 다시 로그인해 주세요.");
        window.location.href = `/`;
      })
      .catch((err) => {
        console.error("정보 수정 실패:", err);
      });
  }

  function quit() {
    if (!window.confirm("정말로 탈퇴하시겠습니까?")) {
      return;
    }
    axios
      .post(`http://localhost:9090/workshop/owner-quit?ownerId=${ownerId}`)
      .then((res) => {
        alert("탈퇴 처리되었습니다.");
        logout();
        window.location.href = `/`;
      })
      .catch((err) => console.error("회원 탈퇴 실패:", err));
  }

  if (!user.userId) {
    return <div className="ws-my-content-box">로딩 중...</div>;
  }

  const existingImageUrl = user.profileImg
    ? `http://localhost:9090/upload/user/${ownerId}/${user.profileImg}`
    : null;

  return (
    <div className="ws-content-box">
      <div className="ws-my-wrapper">
        <h3 className="ws-my-title">내 정보</h3>

        <form onSubmit={modify} className="ws-my-form">
          <div className="ws-my-layout">
            <div className="ws-my-left">
              <div className="ws-my-profile-img-container">
                <FileUpload
                  type="single"
                  name="profileImg"
                  onChange={setThumb}
                  initialPreviewUrl={existingImageUrl}
                />
              </div>

              <div className="ws-my-form-group">
                <label className="ws-my-form-label">이름</label>
                <input
                  id="myinfo-name"
                  type="text"
                  value={user.name}
                  name="name"
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="ws-my-form-input"
                />
              </div>
            </div>

            <div className="ws-my-right">
              <div className="ws-my-form-group">
                <label className="ws-my-form-label">전화 번호</label>
                <input
                  id="myinfo-phone"
                  type="text"
                  value={user.phone}
                  name="phone"
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  className="ws-my-form-input"
                />
              </div>

              <div className="ws-my-form-group">
                <label className="ws-my-form-label">이메일</label>
                <input
                  id="myinfo-email"
                  type="text"
                  value={user.email}
                  name="email"
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="ws-my-form-input"
                />
              </div>

              <div className="ws-my-form-group">
                <span className="ws-pwd-change">
                  <label className="ws-my-form-label">비밀번호 변경</label>
                  <button
                    type="button"
                    className="ws-my-button ws-my-button-primary"
                    onClick={() => {
                      setIsModalOpen(true);
                    }}
                  >
                    변경
                  </button>
                </span>
              </div>

              <div className="ws-my-btn-group">
                <button
                  type="submit"
                  className="ws-my-button ws-my-button-primary"
                >
                  정보 수정
                </button>
                <button
                  type="button"
                  onClick={quit}
                  className="ws-my-button ws-my-button-secondary"
                >
                  회원 탈퇴
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <WsModal
        isActive={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="pwdChange"
      />
    </div>
  );
}

export default MyInfo;
