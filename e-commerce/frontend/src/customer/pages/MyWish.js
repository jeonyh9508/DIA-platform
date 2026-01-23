import React, { useState, useEffect } from "react";
import axios from "../../api/axiosConfig";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import "../css/MyWish.css";
import Footer from "../components/Footer";
import LoadMore from "../components/LoadMore";
import { toast } from "react-toastify";

function MyWish({ userId }) {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 더보기 버튼
  const [visibleCount, setVisibleCount] = useState(6);
  const handleLoadMore = () => setVisibleCount((prev) => prev + 6);

  useEffect(() => {
    axios
      .get(`/customer/my-wish?userId=${userId}`)
      .then((res) => {
        const wishIcon = res.data.map((item) => ({
          ...item,
          isWished: true,
        }));
        setWishes(wishIcon);
        setLoading(false);
      })
      .catch((err) => {
        console.error("위시리스트 불러오기 오류:", err);
        setError("위시리스트를 불러오는 데 실패했습니다.");
        setLoading(false);
      });
  }, [userId]);

  const toggleWish = (programId) => {
    setWishes((prevList) =>
      prevList.map((item) =>
        item.programId === programId
          ? { ...item, isWished: !item.isWished }
          : item,
      ),
    );
    const updatedItem = wishes.find((item) => item.programId === programId);
    if (!updatedItem) return;

    const action = updatedItem.isWished ? "remove" : "add";

    axios
      .post(`/customer/toggle-wish`, {
        userId,
        programId: programId,
        action,
      })
      .then((res) => {
        console.log("위시리스트 토글 성공:", res.data);
        if (action === "add") {
          toast("💖 위시리스트에 추가되었습니다.");
        } else {
          toast("🤍 위시리스트에서 삭제되었습니다.");
        }
      })
      .catch((err) => {
        console.error("위시리스트 토글 오류:", err);
        alert("위시리스트 변경에 실패했습니다. 다시 시도해주세요.");
        // 오류 발생 시 UI 상태를 이전으로 롤백 (선택 사항)
        setWishes((prevList) =>
          prevList.map((item) =>
            item.programId === programId
              ? { ...item, isWished: !item.isWished } // 이전 상태로 되돌림
              : item,
          ),
        );
      });
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }
  if (error) {
    return <div>오류: {error}</div>;
  }

  if (!wishes || wishes.length === 0) {
    return (
      <div className="my-page">
        <Header />
        <main className="mypage-container">
          <nav className="breadcrumb">
            <span>
              <Link to="http://localhost:3000/customer/mypage" className="link">
                마이페이지
              </Link>{" "}
              &gt; 위시리스트
            </span>
          </nav>
          <h1 className="page-title">위시리스트</h1>
          <p className="no-items">아직 위시리스트에 담은 클래스가 없습니다.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="my-page">
      <Header />
      <div className="mypage-container">
        <nav className="breadcrumb">
          <span>
            <Link to="http://localhost:3000/customer/mypage" className="link">
              마이페이지
            </Link>{" "}
            &gt; 위시리스트
          </span>
        </nav>
        <h1 className="page-title">위시리스트</h1>
        {!loading && wishes.length > 0 && (
          <p className="content-count">{wishes.length}개의 위시</p>
        )}
        <div className="wishlist-grid">
          {wishes.slice(0, visibleCount).map((item) => (
            // 1. 클릭 시 프로그램 상세 페이지로 이동
            <div
              className="program-card"
              key={`${item.programId}-${item.isWished}`}
            >
              {console.log(item)}
              <Link to={`/customer/program/${item.programId}`} className="link">
                <div className="card-image-container">
                  <div className="card-image-placeholder">
                    {/* 썸네일 이미지 */}

                    {item.thumb != null ? (
                      <img
                        src={`http://localhost:9090/upload/workshop/${item.workshopId}/program/${item.programId}/${item.thumb}`}
                        alt="프로그램 이미지"
                      />
                    ) : (
                      <p>이미지 없음</p>
                    )}
                    {/* 썸네일 위에 베이킹 태그 */}
                    <div className="card-category-badge">{item.category}</div>

                    <button
                      className={`wish-icon ${item.isWished ? "on" : "off"}`}
                      onClick={(e) => {
                        e.preventDefault(); // 페이지 이동을 막음
                        e.stopPropagation(); // 이벤트 전파를 막아 Link 클릭 방지
                        toggleWish(item.programId); // 위시 상태 토글 함수 호출
                      }}
                    >
                      {item.isWished ? "❤️" : "🤍"} {/* 꽉 찬 하트 / 빈 하트 */}
                    </button>
                  </div>
                </div>

                <div className="card-info">
                  {/* 2. 공방 프로필 이미지, 공방명, 프로그램명 */}
                  <div className="workshop-program-title">
                    <div className="workshop-profile-thumb">
                      {item.profileImg != null ? (
                        <img
                          src={`http://localhost:9090/upload/workshop/${item.workshopId}/${item.profileImg}`}
                          alt="워크샵 이미지"
                          className="workshop-profile-thumb"
                        />
                      ) : (
                        <p>x</p>
                      )}
                    </div>
                    <span className="card-workshop-name">
                      {item.workshopName}
                    </span>
                  </div>
                  <h3 className="card-title">{item.title}</h3>
                  {/* 3. 별점, 리뷰 수, 위시 수 */}
                  <div className="card-stats">
                    <span className="card-rating">
                      ⭐ {item.averageRating.toFixed(1)} ({item.countReview})
                    </span>
                    <span className="wish-count">❤️ {item.countWish}</span>
                  </div>
                  {/* 4. 위치 아이콘과 주소 */}

                  <span className="card-location">📍{item.address}</span>

                  {/* 5. 가격 */}
                  <div className="card-price">
                    {item.price.toLocaleString()}원
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <LoadMore
          visibleCount={visibleCount}
          handleLoadMore={handleLoadMore}
          items={wishes}
        />
      </div>

      <Footer />
    </div>
  );
}

export default MyWish;
