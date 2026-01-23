import React, { useState } from "react";
import ReactDOM from "react-dom";

function QnaCustomerInfoModal({ userDetail, isModalOpen, setIsModalOpen }) {
  const [copyMessage, setCopyMessage] = useState("");
  const closeModal = (e) => {
    e.stopPropagation();
    setIsModalOpen(false);
    setCopyMessage("");
  };

  // 텍스트 복사 기능
  const copyText = (e, text) => {
    e.stopPropagation();
    if (!text) return;

    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopyMessage(`"${text}" 복사됨`);
        setTimeout(() => setCopyMessage(""), 1500);
      })
      .catch(() => {
        alert("복사 실패");
      });
  };
  return (
    <>
      {isModalOpen &&
        ReactDOM.createPortal(
          <div className="user-modal-overlay" onClick={closeModal}>
            <div className="user-modal" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={closeModal}>
                ✖
              </button>

              <h2 className="modal-title">유저 상세 정보</h2>

              {/* 복사 메시지 토스트 */}
              {copyMessage && <div className="copy-toast">{copyMessage}</div>}
              {!copyMessage ? (
                <div className="copy-toast-none">
                  유저 정보 클릭 시 복사 가능
                </div>
              ) : (
                ""
              )}
              {!userDetail ? (
                <p className="loading-text">불러오는 중...</p>
              ) : (
                <div className="modal-user-info">
                  <table>
                    <thead>
                      <tr>
                        <th>
                          <i className="fi fi-rr-user"></i> 이름
                        </th>
                        <td
                          className="copy-cell"
                          onClick={(e) => copyText(e, userDetail.name)}
                        >
                          {userDetail.name}
                        </td>
                        <td>
                          <i
                            className="fi fi-rr-copy"
                            onClick={(e) => copyText(e, userDetail.name)}
                          ></i>
                        </td>
                      </tr>
                      <tr>
                        <th>
                          <i className="fi fi-rr-envelope"></i> 이메일
                        </th>
                        <td
                          className="copy-cell"
                          onClick={(e) => copyText(e, userDetail.email)}
                        >
                          {userDetail.email}
                        </td>
                        <td>
                          <i
                            className="fi fi-rr-copy"
                            onClick={(e) => copyText(e, userDetail.email)}
                          ></i>
                        </td>
                      </tr>
                      <tr>
                        <th>
                          <i className="fi fi-rr-phone-call"></i> 전화번호
                        </th>
                        <td
                          className="copy-cell"
                          onClick={(e) => copyText(e, userDetail.phone)}
                        >
                          {userDetail.phone}
                        </td>
                        <td>
                          <i
                            className="fi fi-rr-copy"
                            onClick={(e) => copyText(e, userDetail.phone)}
                          ></i>
                        </td>
                      </tr>
                      <tr>
                        <th>
                          <i className="fi fi-rr-calendar"></i> 가입일
                        </th>
                        <td
                          className="copy-cell"
                          onClick={(e) => copyText(e, userDetail.createdAt)}
                        >
                          {userDetail.createdAt}
                        </td>
                        <td>
                          <i
                            className="fi fi-rr-copy"
                            onClick={(e) => copyText(e, userDetail.createdAt)}
                          ></i>
                        </td>
                      </tr>
                    </thead>
                  </table>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
export default QnaCustomerInfoModal;
