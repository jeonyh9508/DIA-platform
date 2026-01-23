import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FileUpload from "../components/FileUpload";
import "../css/WorkshopForm.css";

function WorkshopModi({ ownerId }) {
  const navigate = useNavigate();
  const { workshopId } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [status, setStatus] = useState("정상");
  const [thumb, setThumb] = useState(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState();
  const [approved, setApproved] = useState(null);

  useEffect(() => {
    if (!workshopId) return;

    axios
      .get(`http://localhost:9090/workshop/info?workshopId=${workshopId}`)
      .then((res) => {
        const workshop = res.data;
        setName(workshop.name);
        setDescription(workshop.description);
        setAddress(workshop.address);
        setContactNumber(workshop.contactNumber);
        setStatus(workshop.status);
        setActive(workshop.active);
        setApproved(workshop.approved);
        setLoading(false);
      })
      .catch((err) => {
        console.error("공방 정보 불러오기 오류:", err);
        setLoading(false);
      });
  }, [workshopId]);

  function modify(e) {
    e.preventDefault();

    if (!description) return alert("공방의 설명을 입력해주세요.");
    if (!contactNumber) return alert("공방의 연락처를 입력해주세요.");

    const workshop = {
      workshopId,
      ownerId: ownerId,
      description,
      contactNumber: contactNumber,
      status,
      approved: approved,
    };

    const formData = new FormData();
    formData.append(
      "workshop",
      new Blob([JSON.stringify(workshop)], { type: "application/json" }),
    );
    if (thumb) formData.append("file", thumb);

    axios
      .post("http://localhost:9090/workshop/ws-modify", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        alert("공방 정보가 수정되었습니다.");
        navigate(`/workshop`);
      })
      .catch((err) => {
        console.error("수정 오류:", err);
        alert("공방 수정 중 오류가 발생했습니다.");
      });
  }

  function toggleActive() {
    if (active) {
      if (
        !window.confirm(
          "공방을 비활성화 하시겠습니까?\n(※운영중인 프로그램도 함께 비활성화 됩니다.)",
        )
      )
        return;
    } else {
      if (!window.confirm("공방을 활성화 하시겠습니까?")) return;
    }
    const newActive = !active;
    const deactivateVO = {
      workshopId,
      ownerId: ownerId,
      active: newActive,
    };

    axios
      .post("http://localhost:9090/workshop/ws-del", deactivateVO)
      .then(() => {
        setActive(!active);
        alert(
          active ? "공방이 비활성화되었습니다." : "공방이 활성화되었습니다.",
        );
        navigate("/workshop");
      })
      .catch((err) => {
        console.error("토글 오류:", err);
        alert("상태 변경 중 오류가 발생했습니다.");
      });
  }
  if (loading)
    return (
      <div className="ws-loading-message">공방 정보를 불러오는 중입니다...</div>
    );

  return (
    <div className="ws-workshop-form-container">
      <div className="ws-split-left">
        <img
          src={"http://localhost:9090/upload/logo/dia_for_owner.png"}
          alt="D.I.A Logo"
          className="ws-logo-icon"
        />
      </div>

      <div className="ws-split-right">
        <form onSubmit={modify} className="ws-modify-form">
          <h1 className="ws-form-title">공방 수정</h1>
          <input type="hidden" name="ownerId" value={ownerId} />
          <input type="hidden" name="workshopId" value={workshopId} />

          <h3 className="ws-workshop-name">{name}</h3>

          <div className="ws-form-group">
            <label className="ws-form-label">설명</label>
            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <label className="ws-form-label">주소</label>
          <div className="ws-form-group ws-address-display">
            <p className="ws-address-text">{address}</p>
          </div>

          <div className="ws-form-group">
            <label className="ws-form-label">연락처</label>
            <input
              name="contactNumber"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              type="text"
            />
          </div>

          <div className="ws-form-group">
            <FileUpload
              label="공방 프로필 사진"
              type="single"
              name="profileImg"
              onChange={setThumb}
            />
          </div>

          <div className="ws-form-group ws-status-group">
            <label className="ws-form-label">상태</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="정상">정상</option>
              <option value="휴업">휴업</option>
              <option value="숨김">숨김</option>
            </select>
          </div>

          <div className="ws-modal-action-buttons ws-form-submit">
            <button type="submit" className="ws-btn-confirm">
              수정
            </button>
            {active ? (
              <button
                type="button"
                onClick={toggleActive}
                className="ws-btn-deactivate"
              >
                공방 비활성화
              </button>
            ) : (
              <button
                type="button"
                onClick={toggleActive}
                className="ws-btn-deactivate"
              >
                공방 활성화
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default WorkshopModi;
