import React from "react";
import AddAdminQna from "./AddAdminQna";
import ModifyAdminQna from "./ModifyAdminQna";

function MyQnaModal({
  modalType,
  setModalType,
  userId,
  selectedQna,
  setSelectedQna,
}) {
  return (
    <div>
      {/* 모달 통합 */}
      {modalType && (
        <div className="modal-overlay" onClick={() => setModalType(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {modalType === "add" && (
              <AddAdminQna userId={userId} onClose={() => setModalType(null)} />
            )}

            {modalType === "modify" && (
              <ModifyAdminQna
                userId={userId}
                qna={selectedQna}
                onClose={() => setModalType(null)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default MyQnaModal;
