import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import Footer from "../components/Footer";
import "../css/MyQna.css";
import LoadMore from "../components/LoadMore";
import { Link } from "react-router-dom";
import MyQnaModal from "../components/MyPage/MyQna/MyQnaModal";
import MyQnaNav from "../components/MyPage/MyQna/MyQnaNav";
import MyQnaFilters from "../components/MyPage/MyQna/MyQnaFilters";
import MyQnaLists from "../components/MyPage/MyQna/MyQnaLists";

function MyQna({ userId }) {
  const [myQnas, setMyQnas] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [filter, setFilter] = useState("전체");
  const [showAnsweredOnly, setShowAnsweredOnly] = useState(false);

  // 모달 타입 (null | "add" | "modify")
  const [modalType, setModalType] = useState(null);

  // 수정 페이지용 선택된 QnA
  const [selectedQna, setSelectedQna] = useState(null);

  // QNA 목록 불러오기

  useEffect(() => {
    axios
      .get(`http://localhost:9090/customer/my-qna?userId=${userId}`)
      .then((res) => setMyQnas(res.data))
      .catch((err) => console.error("문의 정보 불러오기 오류:", err));
  }, [userId]);

  const toggleDetail = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // 필터링된 QNA 리스트
  const filteredQnas = myQnas.filter((qna) => {
    const typeMatch = filter === "전체" || qna.qnaType === filter;
    const statusMatch =
      !showAnsweredOnly || (qna.status && qna.status.trim() === "답변완료");
    return typeMatch && statusMatch;
  });

  // 문의 삭제
  const qnaDelete = (qna) => {
    if (!window.confirm("정말 이 문의를 삭제하시겠습니까?")) return;

    axios
      .delete("http://localhost:9090/customer/my-qna/delete", {
        params: {
          qnaType: qna.qnaType,
          qnaId: qna.qnaId,
          qnaAdminId: qna.qnaAdminId,
        },
      })
      .then(() => {
        alert("문의가 삭제되었습니다.");
        setMyQnas((prev) =>
          prev.filter(
            (item) =>
              !(
                (qna.qnaType === "공방" && item.qnaId === qna.qnaId) ||
                (qna.qnaType === "관리자" && item.qnaAdminId === qna.qnaAdminId)
              )
          )
        );
      })
      .catch((err) => console.error("문의 삭제 오류:", err));
  };

  // 더보기
  const [visibleCount, setVisibleCount] = useState(5);
  const handleLoadMore = () => setVisibleCount((prev) => prev + 5);

  return (
    <div className="my-page">
      <Header />
      <div className="mypage-container">
        <nav className="breadcrumb">
          <span>
            <Link to="http://localhost:3000/customer/mypage" className="link">
              마이페이지
            </Link>{" "}
            &gt; 문의 내역 관리
          </span>
        </nav>
        <div className="page-header">문의 내역 관리</div>
        {/* NAV 필터 */}
        <MyQnaNav filter={filter} setFilter={setFilter} />

        <div className="qna-filters">
          {/* n개의 문의 내역 + 답변 완료만 보기 체크박스 */}
          <MyQnaFilters
            filteredQnas={filteredQnas}
            showAnsweredOnly={showAnsweredOnly}
            setShowAnsweredOnly={setShowAnsweredOnly}
          />

          <div>
            <input
              type="button"
              value="관리자에게 문의하기"
              className="qna-write-button"
              onClick={() => setModalType("add")}
            />
          </div>
        </div>
        {/* QNA LIST */}
        <MyQnaLists
          filteredQnas={filteredQnas}
          visibleCount={visibleCount}
          toggleDetail={toggleDetail}
          openIndex={openIndex}
          setSelectedQna={setSelectedQna}
          setModalType={setModalType}
          qnaDelete={qnaDelete}
        />
        {/* 더보기 버튼 */}
        <LoadMore
          visibleCount={visibleCount}
          items={filteredQnas}
          handleLoadMore={handleLoadMore}
        />
        {/* 모달 통합 */}
        <MyQnaModal
          modalType={modalType}
          setModalType={setModalType}
          userId={userId}
          selectedQna={selectedQna}
          setSelectedQna={setSelectedQna}
        />
      </div>

      <Footer />
    </div>
  );
}

export default MyQna;
