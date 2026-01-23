import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "../css/ApprovalList.css";
import WorkshopApprovalList from "../components/WorkshopApproval/WorkshopApprovalList";
import WorkshopApprovalModal from "../components/WorkshopApproval/WorkshopApprovalModal";
import Pagination from "../../components/Pagination";
import ApprovalFilterBar from "../components/ApprovalFilterBar";

function WorkshopApproval({ userId }) {
  const [workshopList, setWorkshopList] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [keyword, setKeyword] = useState(""); // 실제 검색에 사용하는 값
  const [keywordInput, setKeywordInput] = useState(""); // 인풋에 타이핑 중인 값
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수

  const size = 10; // 페이지당 10개

  const [isOpen, setIsOpen] = useState(false);
  const [workshop, setWorkshop] = useState(null);

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      searchWorkshop();
    }
  }, [filter, keyword]);

  useEffect(() => {
    searchWorkshop();
  }, [sortBy, sortDir, currentPage]);

  const searchWorkshop = () => {
    axios
      .get("http://localhost:9090/erp-system/workshop/list", {
        params: {
          filter,
          keyword,
          sortBy,
          sortDir,
          page: currentPage,
          size: size,
        },
      })
      .then((res) => {
        setWorkshopList(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => {
        console.error("승인 리스트 조회 실패:", err);
      });
  };

  const toggleSort = (column) => {
    if (sortBy === column) {
      // 같은 컬럼을 누르면 asc/desc 토글
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      // 다른 컬럼 누르면 asc로 초기화
      setSortBy(column);
      setSortDir("asc");
    }
  };

  const openModal = async (id) => {
    try {
      const res = await axios.post(
        "http://localhost:9090/erp-system/workshop/detail",
        null,
        { params: { workshopId: id } }
      );

      setWorkshop(res.data);
      setIsOpen(true);
    } catch (err) {
      console.error("승인 내역 조회 실패:", err);
    }
  };

  const closeModal = () => {
    setWorkshop(null);
    setIsOpen(false);
  };

  const handleSubmit = (approvedType, reason) => {
    const approved = approvedType === "승인" ? "승인" : "거절";
    const active = approvedType === "승인";

    const data = {
      approved: approved,
      active: active,
      targetId: workshop.workshopId,
      adminId: userId,
      actionType: approvedType,
      reason: reason || null,
    };

    axios
      .post("http://localhost:9090/erp-system/workshop/update-approved", data)
      .then((res) => {
        if (approvedType === "승인") {
          toast.success("승인이 완료되었습니다.");
        } else if (approvedType === "거절") {
          toast.error("거절 처리가 완료되었습니다.");
        }

        // 리스트 즉시 반영
        setWorkshopList((prev) =>
          prev.map((w) =>
            w.workshopId === workshop.workshopId
              ? { ...w, approved: approvedType }
              : w
          )
        );

        setIsOpen(false);
      })
      .catch((err) => console.error("공방 승인 상태 변경 오류:", err));
  };

  return (
    <main className="erp-approval-page">
      <h2 className="erp-page-title">공방 승인 목록</h2>

      <ApprovalFilterBar
        setFilter={setFilter}
        keywordInput={keywordInput}
        setKeywordInput={setKeywordInput}
        onSearch={() => setKeyword(keywordInput)}
      />

      <WorkshopApprovalList
        workshopList={workshopList}
        sortBy={sortBy}
        sortDir={sortDir}
        toggleSort={toggleSort}
        openModal={openModal}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <WorkshopApprovalModal
        workshop={workshop}
        isOpen={isOpen}
        closeModal={closeModal}
        onSubmit={handleSubmit}
      />
    </main>
  );
}

export default WorkshopApproval;
