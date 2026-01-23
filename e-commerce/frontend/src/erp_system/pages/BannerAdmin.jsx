import React, { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "../css/BannerAdmin.css";
import BannerModifyModal from "../components/BannerAdmin/BannerModifyModal";
import BannerAddModal from "../components/BannerAdmin/BannerAddModal";
import SaveStatus from "../components/BannerAdmin/SaveStatus";
import PreviewModal from "../components/BannerAdmin/PreviewModal";
import Footer from "../../customer/components/Footer";

function AdminBanner({ userId }) {
  const [banners, setBanners] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editBanner, setEditBanner] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [previewAdd, setPreviewAdd] = useState(null);
  const [previewEdit, setPreviewEdit] = useState(null);
  const [saveStatus, setSaveStatus] = useState("saved"); // saved | saving | error
  const [showPreview, setShowPreview] = useState(false);

  /* 초기 로딩: 배너 리스트 */
  useEffect(() => {
    fetchBanners();
  }, []);
  const fetchBanners = () => {
    axios.get("http://localhost:9090/erp-system/banner").then((res) => {
      const sorted = res.data.sort((a, b) => a.sortOrder - b.sortOrder);
      setBanners(sorted);
    });
  };

  /* 드래그 정렬 기능 */
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    // 사용자가 드래그한 직후 상태(이게 UI에 그대로 남아야 함)
    const previous = banners;

    setSaveStatus("saving");

    // UI에서 즉시 순서 변경
    const items = Array.from(banners);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    // UI 업데이트
    const updated = items.map((item, idx) => ({
      ...item,
      sortOrder: idx,
    }));
    setBanners(updated);

    // 0.5초 동안 '저장 중...' 유지
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      for (const item of updated) {
        await axios.put("http://localhost:9090/erp-system/banner/order", null, {
          params: {
            bannerId: item.bannerId,
            sortOrder: item.sortOrder,
          },
        });
      }

      setSaveStatus("saved");
      // 5초 뒤에 문구 자연스럽게 사라지게
      setTimeout(() => setSaveStatus("saved"), 5000);
    } catch (err) {
      console.error(err);
      setSaveStatus("error");

      // 서버 저장 실패 시에만 원래대로 되돌리기
      setBanners(previous);
    }
  };

  /* 배너 삭제 기능 */
  const handleDelete = async (bannerId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    alert("배너가 삭제되었습니다.");

    await axios.delete(`http://localhost:9090/erp-system/banner/${bannerId}`);
    fetchBanners();
  };

  /* 수정 버튼 클릭 */
  const openEditModal = (banner) => {
    setEditBanner(banner);
    setNewImage(null); // 새 이미지 선택 X
    setShowEditModal(true);
  };

  /* 새 배너 추가 버튼 클릭 */
  const handleAddFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewImage(file);
    setPreviewAdd(URL.createObjectURL(file));
  };

  const toggleActive = async (banner) => {
    const original = banner.active;
    const newValue = !original;

    // UI 즉시 반영
    setBanners((prev) =>
      prev.map((b) =>
        b.bannerId === banner.bannerId ? { ...b, active: newValue } : b
      )
    );

    setSaveStatus("saving");
    // 0.5초 동안 '저장 중...' 유지
    await new Promise((resolve) => setTimeout(resolve, 500));
    // 서버 저장 요청
    try {
      await axios.put("http://localhost:9090/erp-system/banner/active", null, {
        params: {
          bannerId: banner.bannerId,
          active: newValue,
        },
      });

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("saved"), 3000);
    } catch (err) {
      console.error("활성/비활성 저장 오류:", err);

      // 실패하면 원래 상태로 되돌리기
      setBanners((prev) =>
        prev.map((b) =>
          b.bannerId === banner.bannerId ? { ...b, active: original } : b
        )
      );

      setSaveStatus("error");
    }
  };

  return (
    <div>
      <div className="erp-main-container">
        <h2>배너 광고 관리</h2>
        <div className="banner-top-row">
          <button
            className="banner-add-btn"
            onClick={() => setShowAddModal(true)}
          >
            + 새 배너 추가
          </button>
          <div className="banner-top-row-right">
            <table>
              <thead>
                <tr>
                  <td>
                    {/* 자동 저장 상태 표시 */}
                    <SaveStatus saveStatus={saveStatus} />
                  </td>
                  <td>
                    <button
                      className="banner-preview-btn"
                      onClick={() => setShowPreview(true)}
                    >
                      미리보기
                    </button>
                  </td>
                </tr>
              </thead>
            </table>
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="banner-table">
            <div className="banner-header">
              <div className="banner-cell drag-col">드래그</div>
              <div className="banner-cell img-col">이미지</div>
              <div className="banner-cell">제목</div>
              <div className="banner-cell">URL</div>
              <div className="banner-cell">활성</div>
              <div className="banner-cell">수정</div>
              <div className="banner-cell">삭제</div>
            </div>

            <Droppable droppableId="bannerList">
              {(provided) => (
                <div
                  className="banner-body"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {banners.map((b, index) => (
                    <Draggable
                      key={b.bannerId}
                      draggableId={String(b.bannerId)}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          className="banner-row"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={provided.draggableProps.style}
                        >
                          <div
                            className="banner-cell drag-col handle"
                            {...provided.dragHandleProps}
                          >
                            ☰
                          </div>

                          <div className="banner-cell img-col">
                            <img
                              src={`http://localhost:9090${b.image}`}
                              alt="banner"
                              width="120"
                            />
                          </div>

                          <div className="banner-cell">{b.title}</div>
                          <div className="banner-cell">{b.link}</div>

                          <div className="banner-cell">
                            <span onClick={() => toggleActive(b)}>
                              {b.active ? (
                                <i className="fi fi-rr-eye"></i>
                              ) : (
                                <i className="fi fi-rr-eye-crossed"></i>
                              )}
                            </span>
                          </div>

                          <div className="banner-cell">
                            <button
                              className="banner-edit-btn"
                              onClick={() => openEditModal(b)}
                            >
                              수정
                            </button>
                          </div>

                          <div className="banner-cell">
                            <button
                              className="banner-delete-btn"
                              onClick={() => handleDelete(b.bannerId)}
                            >
                              삭제
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>

        {/* 수정 모달 */}
        <BannerModifyModal
          showEditModal={showEditModal}
          editBanner={editBanner}
          setEditBanner={setEditBanner}
          previewEdit={previewEdit}
          setShowEditModal={setShowEditModal}
          setPreviewEdit={setPreviewEdit}
          newImage={newImage}
          setNewImage={setNewImage}
          fetchBanners={fetchBanners}
        />

        {/* 등록 모달 */}
        <BannerAddModal
          showAddModal={showAddModal}
          previewAdd={previewAdd}
          handleAddFile={handleAddFile}
          setShowAddModal={setShowAddModal}
          setPreviewAdd={setPreviewAdd}
          newImage={newImage}
          setNewImage={setNewImage}
          userId={userId}
          fetchBanners={fetchBanners}
          banners={banners}
        />

        {/* 미리보기 모달 */}
        <PreviewModal
          show={showPreview}
          onClose={() => setShowPreview(false)}
          banners={banners}
        />
      </div>
      <Footer />
    </div>
  );
}

export default AdminBanner;
