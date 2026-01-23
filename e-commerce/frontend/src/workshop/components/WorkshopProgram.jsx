import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import WsModal from "./WsModal";
import Profit from "./Profit";
import "../css/WorkshopProgram.css";
import { toast } from "react-toastify";

const WorkshopProgram = ({ workshopId, ownerId, type, monthly }) => {
  const [workshop, setWorkshop] = useState({ program: [] });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedProgramId, setSelectedProgramId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState(false);

  const fetchPrograms = useCallback(() => {
    axios
      .get(`http://localhost:9090/workshop/program/ws-program`, {
        params: { workshopId, ownerId },
      })
      .then((res) => {
        setIsLoading(false);
        setWorkshop(res.data[0] || { program: [] });
      })
      .catch(console.error);
  }, [workshopId, ownerId]);

  useEffect(() => {
    if (workshopId && ownerId) fetchPrograms();
  }, [fetchPrograms, workshopId, ownerId]);

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType("");
    setSelectedProgramId(null);
  };

  const openProgramAddModal = () => {
    setModalType("programAdd");
    setIsModalOpen(true);
  };

  const openProgramChartModal = (pId) => {
    setSelectedProgramId(pId);
    setModalType("programProfit");
    setIsModalOpen(true);
  };

  if (isLoading) return <p>프로그램 정보를 불러오는 중입니다.</p>;

  return (
    <div className="wp-container">
      <div className="wp-header">
        <h3 className="wp-title">등록 프로그램 목록</h3>
        {type === "info" && (
          <button
            type="button"
            onClick={openProgramAddModal}
            className="wp-add-btn"
          >
            프로그램 등록
          </button>
        )}
      </div>
      {workshop.program && workshop.program.length > 0 ? (
        <ul className="wp-list-wrapper">
          {" "}
          {workshop.program.map((program) => (
            <li key={program.programId} className="wp-list-item">
              {type === "info" ? (
                <div className="wp-item-info-box">
                  <Link
                    to={`/customer/program/${program.programId}`}
                    className="wp-item-link"
                    onClick={(e) => {
                      if (program.approved === "대기") {
                        e.preventDefault();
                        toast.error("승인 후 이용 가능합니다");
                      }
                      if (program.approved === "거절") {
                        e.preventDefault();
                        setRejectModal(true);
                        setSelectedProgramId(program.programId);
                      }
                    }}
                  >
                    {program.thumb != null ? (
                      <img
                        src={`http://localhost:9090/upload/workshop/${workshopId}/program/${program.programId}/${program.thumb}`}
                        alt="프로그램"
                        className="wp-item-thumb"
                      />
                    ) : (
                      <div className="wp-item-thumb default-img"></div>
                    )}
                    <div className="wp-item-text">
                      <b>{program.title}</b>
                      {program.active ? (
                        <div>
                          <p>{program.description}</p>
                          <p className={`pg-approved-${program.approved}`}>
                            (승인 여부 : {program.approved})
                          </p>
                        </div>
                      ) : (
                        <p className="wp-item-deactivate">
                          비활성화 된 프로그램입니다.
                        </p>
                      )}
                    </div>
                  </Link>
                  <span className="wp-item-price">
                    {program.price.toLocaleString()}원
                  </span>
                </div>
              ) : (
                <div className="wp-item-profit-box">
                  <button
                    className="chart-open-button"
                    onClick={() => openProgramChartModal(program.programId)}
                  >
                    <div className="wp-profit-display">
                      <b>{program.title}</b>
                      <div className="profit-display-wrapper">
                        <Profit programId={program.programId} />
                        <Profit
                          programId={program.programId}
                          monthly={monthly}
                        />
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="wp-list-empty">등록된 프로그램이 없습니다.</p>
      )}

      <WsModal
        isActive={isModalOpen}
        id={modalType === "programAdd" ? workshopId : selectedProgramId}
        type={modalType}
        onClose={closeModal}
        onSuccess={fetchPrograms}
        monthly={monthly}
      />

      <WsModal
        isActive={rejectModal}
        type="rejectReason"
        id={selectedProgramId}
        ownerId={ownerId}
        data="program"
        onClose={() => setRejectModal(false)}
        onSuccess={fetchPrograms}
      />
    </div>
  );
};

export default WorkshopProgram;
