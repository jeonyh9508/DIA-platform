import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import axios from "axios";
import { Link } from "react-router-dom";
import "../css/MyFollow.css";
import Footer from "../components/Footer";
import LoadMore from "../components/LoadMore";
import { toast } from "react-toastify";

function MyFollow({ userId }) {
  const [follows, setFollows] = useState([]);
  const [followStates, setFollowStates] = useState({});
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    axios
      .get(`http://localhost:9090/customer/my-follow?userId=${userId}`)
      .then((res) => {
        setFollows(res.data);

        // 실제 DB 상태대로 저장
        const initialStates = {};
        res.data.forEach((follow) => {
          initialStates[follow.followId] = follow.active;
        });
        setFollowStates(initialStates);
      })
      .catch((err) => console.error("프로그램 정보 불러오기 오류:", err));
  }, [userId]);

  // 팔로우/언팔로우 전환 함수
  const clickFollowBtn = async (followId, active) => {
    try {
      await axios.post(
        "http://localhost:9090/customer/follow/update-follow",
        null,
        {
          params: { followId: followId, active: !active },
        }
      );

      // 팔로우 버튼 상태 변경
      setFollowStates((prev) => ({
        ...prev,
        [followId]: !prev[followId],
      }));
      if (!active) {
        toast("🙋‍♀️ 공방을 팔로우했습니다.");
      } else {
        toast("✋ 공방 팔로우를 취소했습니다.");
      }
    } catch (error) {
      console.error("팔로우 처리 중 오류:", error);
      alert("팔로우 처리 중 오류가 발생했습니다.");
    }
  };

  const handleLoadMore = () => setVisibleCount((prev) => prev + 12);

  return (
    <div className="my-page">
      <Header />

      <div className="mypage-container">
        <nav className="breadcrumb">
          <span>
            <Link to="http://localhost:3000/customer/mypage" className="link">
              마이페이지
            </Link>{" "}
            &gt; 팔로우 목록
          </span>
        </nav>
        <h1 className="page-title">팔로우 목록</h1>
        {<p className="content-count">{follows.length}개의 팔로우</p>}
        <div className="my-follow-info">
          {follows.length > 0 ? (
            follows.slice(0, visibleCount).map((follow) => {
              return (
                <div key={follow.followId} className="my-follow-card">
                  <Link
                    to={`/customer/workshop/${follow.workshopId}`}
                    className="link"
                  >
                    <div
                      className={`profile-img ${
                        follow.profileImg == null ? "no-image" : ""
                      }`}
                    >
                      {follow.profileImg != null ? (
                        <img
                          src={`http://localhost:9090/upload/workshop/${follow.workshopId}/${follow.profileImg}`}
                          alt="워크샵 이미지"
                        />
                      ) : (
                        <p>이미지 없음</p>
                      )}
                    </div>
                  </Link>

                  <Link
                    to={`/customer/workshop/${follow.workshopId}`}
                    className="link"
                  >
                    <div className="workshop-name">{follow.name}</div>
                  </Link>

                  <div>
                    <button
                      className={`follow-btn ${
                        followStates[follow.followId] ? "following" : ""
                      }`}
                      onClick={() =>
                        clickFollowBtn(
                          follow.followId,
                          followStates[follow.followId]
                        )
                      }
                    >
                      {followStates[follow.followId] ? "팔로잉" : "+ 팔로우"}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p>팔로우한 공방이 없습니다.</p>
          )}
        </div>
        <LoadMore
          visibleCount={visibleCount}
          items={follows}
          handleLoadMore={handleLoadMore}
        />
      </div>
      <Footer />
    </div>
  );
}

export default MyFollow;
