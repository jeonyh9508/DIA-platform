import React, { useState, useEffect } from "react";
import axios from "axios";
import WsModal from "./WsModal";
import MessageForm from "./MessageForm";
import "../css/FollowWish.css";

function FollowWish({
  workshopId,
  workshopName,
  programId,
  programTitle,
  onClose,
}) {
  const [follow, setFollow] = useState([]);
  const [wish, setWish] = useState([]);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!workshopId && !programId) return;

    if (workshopId) {
      axios
        .get(`http://localhost:9090/workshop/follow?workshopId=${workshopId}`)
        .then((res) => setFollow(res.data))
        .catch((err) => alert(err));
    }
    if (programId) {
      axios
        .get(
          `http://localhost:9090/workshop/program/wish-list?programId=${programId}`
        )
        .then((res) => setWish(res.data))
        .catch((err) => alert(err));
    }
  }, [workshopId, programId]);

  const followIdList = follow.map((f) => f.userId);
  const wishIdList = wish.map((w) => w.userId);

  return (
    <div className="ws-follow-wish-container">
      {workshopId && !programId && (
        <div className="ws-fw-section">
          <h3 className="ws-fw-title">
            팔로워 목록 ({follow.length}명){" "}
            <button
              onClick={() => setModalOpen(true)}
              className="ws-message-send"
            >
              메시지 발송
            </button>
          </h3>
          <hr className="ws-fw-divider" />

          {follow.length > 0 ? (
            <ul className="ws-fw-list">
              {follow.map((f) => (
                <li key={f.followId} className="ws-fw-list-item">
                  <span className="ws-name">{f.name}</span>
                  <span className="ws-date">
                    {new Date(f.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="ws-fw-empty-message">팔로워가 없습니다 😢</p>
          )}
        </div>
      )}

      {programId && (
        <div className="ws-fw-section">
          <div className="ws-fw-header">
            <h3 className="ws-fw-title">위시 리스트 ({wish.length}명)</h3>
            <button
              onClick={() => setShowMessageForm(!showMessageForm)}
              className="ws-message-send"
            >
              메시지 발송
            </button>
          </div>
          <hr className="ws-fw-divider" />

          {showMessageForm && (
            <div className="ws-message-form-wrapper">
              <MessageForm
                idList={wishIdList}
                title={programTitle}
                programId={programId}
                workshopId={workshopId}
                onClose={() => setShowMessageForm(false)}
              />
            </div>
          )}
          {wish.length > 0 ? (
            <ul className="ws-fw-list">
              {wish.map((w) => (
                <li key={w.wishId} className="ws-fw-list-item">
                  <span className="ws-name">{w.name}</span>
                  <span className="ws-date">
                    {new Date(w.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="ws-fw-empty-message">위시가 없습니다 😢</p>
          )}
        </div>
      )}

      <WsModal
        isActive={modalOpen}
        type="message"
        workshopId={workshopId}
        data={followIdList}
        name={workshopName}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}

export default FollowWish;
