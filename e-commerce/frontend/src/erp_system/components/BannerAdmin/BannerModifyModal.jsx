import axios from "axios";
import React from "react";

function BannerModifyModal({
  showEditModal,
  editBanner,
  setEditBanner,
  previewEdit,
  setShowEditModal,
  setPreviewEdit,
  newImage,
  setNewImage,
  fetchBanners,
}) {
  /* 수정 저장 */
  const handleSaveEdit = async () => {
    const formData = new FormData();
    formData.append("bannerId", editBanner.bannerId);
    formData.append("title", editBanner.title);
    formData.append("link", editBanner.link);
    formData.append("active", editBanner.active);

    // 기존 sortOrder도 함께 보내기!
    formData.append("sortOrder", editBanner.sortOrder);
    if (newImage) {
      formData.append("file", newImage);
    }

    try {
      await axios.put("http://localhost:9090/erp-system/banner", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (!window.confirm("배너를 수정하시겠습니까?")) {
        return;
      }
      alert("배너가 수정되었습니다.");
      setShowEditModal(false);
      fetchBanners();
    } catch (err) {
      console.error(err);
      alert("수정 실패");
    }
  };
  const handleEditFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewImage(file);
    setPreviewEdit(URL.createObjectURL(file));
  };
  return (
    <div>
      {showEditModal && (
        <div className="banner-banner-modal">
          <div className="banner-modal-content">
            <h3>배너 수정</h3>

            <label>제목</label>
            <input
              type="text"
              value={editBanner.title}
              onChange={(e) =>
                setEditBanner({ ...editBanner, title: e.target.value })
              }
            />

            <label>URL</label>
            <input
              type="text"
              value={editBanner.link}
              onChange={(e) =>
                setEditBanner({ ...editBanner, link: e.target.value })
              }
            />

            <label>기존 이미지</label>
            <img
              src={`http://localhost:9090${editBanner.image}`}
              alt="배너"
              width="200"
            />
            <label>배너</label>
            <div className="drag-area">
              {previewEdit ? (
                <img src={previewEdit} alt="preview" className="preview-img" />
              ) : (
                <p>파일을 이곳에 드래그하거나 클릭하세요</p>
              )}
              <input type="file" accept="image/*" onChange={handleEditFile} />
            </div>

            <label className="banner-checkbox-row">
              <input
                type="checkbox"
                checked={editBanner.active}
                onChange={() =>
                  setEditBanner({
                    ...editBanner,
                    active: !editBanner.active,
                  })
                }
              />
              활성화
            </label>

            <div className="banner-modal-btns">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setPreviewEdit(null);
                  setNewImage(null);
                }}
              >
                취소
              </button>
              <button className="banner-save-btn" onClick={handleSaveEdit}>
                수정 저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default BannerModifyModal;
