import React from "react";
import AddressSearch from "./AddressSearch";
import ProgramForm from "./ProgramForm";
import ReportContent from "./ReportContent";
import Notice from "./Notice";
import ProfitChart from "./ProfitChart";
import ScheduleManage from "./ScheduleManage";
import Reservation from "./Reservation";
import FollowWish from "./FollowWish";
import MessageForm from "./MessageForm";
import PaidProfit from "./PaidProfit";
import NotiContent from "./NotiContent";
import "../css/WsModal.css";
import QnaAdmin from "./QnaAdmin";
import FindPassword from "../../common/FindPassword";
import RejectReason from "./RejectReason";

function WsModal({
  isActive,
  onClose,
  onSuccess,
  type,
  id,
  data,
  addressSelect,
  readMark,
  monthly,
  userId,
  workshopId,
  programTitle,
  name,
}) {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`ws-modal ${isActive ? "active" : ""}`}
      onMouseDown={handleOverlayClick}
    >
      <div
        className={`ws-modal-body ${
          type === "pwdChange" ? "ws-my-pwd-change" : ""
        }`}
      >
        <button type="button" className="ws-modal-close-btn" onClick={onClose}>
          &times;
        </button>

        {type === "addressSearch" && (
          <AddressSearch addressSelect={addressSelect} onClose={onClose} />
        )}
        {type === "programAdd" && (
          <ProgramForm
            workshopId={id}
            onClose={onClose}
            onSuccess={onSuccess}
            userId={userId}
            type="programAdd"
          />
        )}
        {type === "programModi" && (
          <ProgramForm
            programId={id}
            onClose={onClose}
            update={data}
            workshopId={workshopId}
            type="programModi"
          />
        )}
        {type === "reportContent" && (
          <ReportContent workshopId={id} onClose={onClose} qna={data} />
        )}
        {type === "notice" && (
          <Notice
            workshopId={id}
            notice={data}
            onClose={onClose}
            readMark={readMark}
          />
        )}
        {type === "programProfit" && (
          <ProfitChart
            type="programProfit"
            programId={id}
            monthly={monthly}
            onClose={onClose}
          />
        )}
        {type === "scheduleManage" && (
          <ScheduleManage programId={id} onClose={onClose} userId={userId} />
        )}
        {type === "reservation" && (
          <Reservation programId={id} onClose={onClose} />
        )}
        {type === "wishList" && (
          <FollowWish
            workshopId={workshopId}
            programTitle={programTitle}
            programId={id}
            onClose={onClose}
          />
        )}
        {type === "message" && (
          <MessageForm
            onClose={onClose}
            idList={data}
            programId={id}
            title={name}
            workshopId={workshopId}
          />
        )}
        {type === "paid" && (
          <PaidProfit
            workshopId={workshopId}
            monthly={monthly}
            paid={data}
            onClose={onClose}
          />
        )}
        {type === "notification" && (
          <NotiContent data={data} onClose={onClose} />
        )}
        {type === "qnaAdmin" && (
          <div className="qna-admin-modal">
            <QnaAdmin ownerId={id} onClose={onClose} />{" "}
          </div>
        )}
        {type === "pwdChange" && <FindPassword onPasswordChanged={onClose} />}
        {type === "rejectReason" && (
          <RejectReason
            type={data}
            onClose={onClose}
            id={id}
            onSuccess={onSuccess}
          />
        )}
      </div>
    </div>
  );
}

export default WsModal;
