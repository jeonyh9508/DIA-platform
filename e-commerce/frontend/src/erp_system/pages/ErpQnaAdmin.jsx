import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/ErpQnaAdmin.css";
import LoadMore from "../../customer/components/LoadMore";
import Footer from "../../customer/components/Footer";
import ErpQnaFilters from "../components/ErpQnaAdmin/ErpQnaFilters";
import QnaCardHeader from "../components/ErpQnaAdmin/QnaCardHeader";
import QnaCardDetail from "../components/ErpQnaAdmin/QnaCardDetail";
import ErpQnaFiltersButton from "../components/ErpQnaAdmin/ErpQnaFiltersButton";

function ErpQnaAdmin({ userId }) {
  const [qnaList, setQnaList] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  const [filters, setFilters] = useState({
    role: "",
    status: "",
    keyword: "",
    startDate: "",
    endDate: "",
  });

  const BASE_URL = "http://localhost:9090/erp-system/qna-admin";

  // 검색 요청
  const handleSearch = async () => {
    try {
      const response = await axios.get(BASE_URL, { params: filters });
      setQnaList(response.data);
    } catch (error) {
      console.error("관리자 문의 조회 오류:", error);
      alert("조회 중 오류가 발생했습니다.");
    }
  };

  // 첫 렌더링 시 전체 조회
  useEffect(() => {
    handleSearch();
  }, []);

  // 필터 변경
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // 카드 클릭 → 상세 펼침/닫힘
  const toggleDetail = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // 대기/답변완료 count
  const waitingCount = qnaList.filter((q) => q.status === "대기").length;
  const answeredCount = qnaList.filter((q) => q.status === "답변완료").length;

  // 더보기
  const [visibleCount, setVisibleCount] = useState(5);
  const handleLoadMore = () => setVisibleCount((prev) => prev + 5);

  return (
    <div>
      <main className="erp-main-container">
        <h2>고객 문의 관리</h2>

        {/* 검색 필터 */}
        <div className="erp-qna-filter-section">
          <ErpQnaFilters
            handleChange={handleChange}
            filters={filters}
            setFilters={setFilters}
            handleSearch={handleSearch}
          />
          <ErpQnaFiltersButton
            setFilters={setFilters}
            handleSearch={handleSearch}
          />
        </div>
        {/* QNA 카드 리스트 */}
        <div className="erp-qna-list">
          <div className="count-board">
            <p className="content-count">{qnaList.length}건의 문의 내역</p>
            <div className="status-board">
              <p className="content-count-waiting">대기 {waitingCount}</p>
              <p className="content-count-answered">
                답변 완료 {answeredCount}
              </p>
            </div>
          </div>
          {qnaList.length === 0 ? (
            <div className="empty">조회된 문의가 없습니다.</div>
          ) : (
            qnaList.slice(0, visibleCount).map((qna, index) => (
              <div key={qna.qnaAdminId} className="erp-qna-item">
                {/*카드 헤더*/}
                <QnaCardHeader
                  userId={userId}
                  toggleDetail={toggleDetail}
                  index={index}
                  qna={qna}
                />
                {/* 상세 내용 */}
                <QnaCardDetail
                  index={index}
                  openIndex={openIndex}
                  qna={qna}
                  handleSearch={handleSearch}
                  userId={userId}
                />
              </div>
            ))
          )}
          {/* 더보기 버튼 */}
          <LoadMore
            visibleCount={visibleCount}
            items={qnaList}
            handleLoadMore={handleLoadMore}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ErpQnaAdmin;
