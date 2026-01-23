import axios from "axios";
import React, { useState } from "react";

function BannerAddModal({
  showAddModal,
  previewAdd,
  handleAddFile,
  setShowAddModal,
  setPreviewAdd,
  newImage,
  setNewImage,
  userId,
  fetchBanners,
  banners,
}) {
  // 신규 배너 입력
  const [newBanner, setNewBanner] = useState({
    title: "",
    link: "",
    active: true,
  });
  /* 배너 등록 (Modal) */
  const handleSaveNewBanner = async () => {
    if (!newImage) {
      alert("이미지를 선택하세요!");
      return;
    }

    const formData = new FormData();
    formData.append("title", newBanner.title);
    formData.append("link", newBanner.link);
    formData.append("active", newBanner.active);
    formData.append("file", newImage);
    formData.append("adminId", userId);
    formData.append("sortOrder", banners.length);

    try {
      await axios.post("http://localhost:9090/erp-system/banner", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (!window.confirm("배너를 등록하시겠습니까?")) {
        return;
      }
      alert("배너가 등록되었습니다.");
      setShowAddModal(false);
      setNewBanner({ title: "", link: "", active: true });
      setNewImage(null);
      fetchBanners();
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("등록 실패");
    }
  };
  return (
    <div>
      {showAddModal && (
        <div className="banner-banner-modal">
          <div className="banner-modal-content">
            <h3>새 배너 등록</h3>

            <label>제목</label>
            <input
              type="text"
              value={newBanner.title}
              onChange={(e) =>
                setNewBanner({ ...newBanner, title: e.target.value })
              }
            />

            <label>URL</label>
            <input
              type="text"
              value={newBanner.link}
              onChange={(e) =>
                setNewBanner({ ...newBanner, link: e.target.value })
              }
            />
            <label>배너</label>
            <div className="drag-area">
              {previewAdd ? (
                <img src={previewAdd} alt="preview" className="preview-img" />
              ) : (
                <p>파일을 이곳에 드래그하거나 클릭하세요</p>
              )}
              <input type="file" accept="image/*" onChange={handleAddFile} />
            </div>

            <label className="banner-checkbox-row">
              <input
                type="checkbox"
                checked={newBanner.active}
                onChange={() =>
                  setNewBanner({ ...newBanner, active: !newBanner.active })
                }
              />
              활성화
            </label>

            <div className="banner-modal-btns">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setPreviewAdd(null);
                  setNewImage(null);
                }}
              >
                취소
              </button>
              <button className="banner-save-btn" onClick={handleSaveNewBanner}>
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default BannerAddModal;
