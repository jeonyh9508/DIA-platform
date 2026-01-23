import axios from "axios";
import React, { useState } from "react";
import WsModal from "../components/WsModal";
import { useNavigate } from "react-router-dom";
import FileUpload from "../components/FileUpload";
import "../css/WorkshopForm.css";

function WorkshopAdd({ ownerId }) {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [thumb, setThumb] = useState(null);

  const handleAddressSelect = (selectedAddress) => {
    setAddress(selectedAddress);
    setIsModalOpen(false);
  };

  const insert = (e) => {
    e.preventDefault();
    const f = e.target;
    if (!f.name.value) return alert("공방명을 입력해주세요.");
    if (!f.description.value) return alert("공방의 설명을 입력해주세요.");
    if (!address) return alert("공방의 주소를 검색해주세요.");
    if (!f.contactNumber.value) return alert("공방의 연락처를 입력해주세요.");

    const data = {
      ownerId: ownerId,
      name: f.name.value,
      description: f.description.value,
      address: address,
      contactNumber: f.contactNumber.value,
    };
    const formData = new FormData();

    formData.append(
      "workshop",
      new Blob([JSON.stringify(data)], { type: "application/json" })
    );
    if (thumb) formData.append("file", thumb);

    axios
      .post("http://localhost:9090/workshop/ws-insert", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        navigate(`/workshop`);
      });
  };

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
        <form
          onSubmit={insert}
          className="ws-add-form"
          encType="multipart/form-data"
        >
          <h1 className="ws-form-title">공방 등록</h1>

          <div className="ws-form-group">
            <input name="name" placeholder="공방 이름" type="text" />
          </div>
          <div className="ws-form-group">
            <textarea name="description" placeholder="설명" />
          </div>

          <div className="ws-form-group ws-address-container">
            <label className="ws-form-label">주소 : </label>
            <input placeholder="주소" value={address} readOnly type="text" />
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="ws-search-button"
            >
              주소검색
            </button>
          </div>

          <div className="ws-form-group">
            <FileUpload
              label="공방 프로필 사진"
              type="single"
              name="profileImg"
              onChange={setThumb}
            />
          </div>

          <div className="ws-form-group">
            <input name="contactNumber" placeholder="연락처" type="text" />
          </div>

          <div className="ws-modal-action-buttons ws-form-submit">
            <button type="submit" className="ws-btn-confirm">
              등록
            </button>
          </div>
        </form>
      </div>

      <WsModal
        isActive={isModalOpen}
        type="addressSearch"
        onClose={() => setIsModalOpen(false)}
        addressSelect={handleAddressSelect}
      />
    </div>
  );
}

export default WorkshopAdd;
