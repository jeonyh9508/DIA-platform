import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function WorkshopAllFollowButton({ userId, workshop }) {
  // 팔로우 기능
  const [followStates, setFollowStates] = useState({});
  const handleFollowToggle = async (e, workshopId) => {
    e.preventDefault(); // link 이동 workshopId
    e.stopPropagation(); // 부모 이벤트 전파 차단
    if (!userId) {
      toast.error("로그인이 필요합니다.");
    }
    try {
      await axios.post(
        `http://localhost:9090/customer/follow/workshop-follow?userId=${userId}`,
        {
          userId: userId,
          workshopId: workshopId,
        }
      );

      setFollowStates((prev) => ({
        ...prev,
        [workshopId]: !prev[workshopId],
      }));
      if (!followStates[workshopId]) {
        toast("🙋‍♀️ 공방을 팔로우했습니다.");
      } else {
        toast("✋ 공방 팔로우를 취소했습니다.");
      }
    } catch (err) {
      console.error("팔로우 토글 실패:", err);
      console.log("팔로우 요청 데이터:", { userId, workshopId });
    }
  };
  useEffect(() => {
    const fetchFollows = async () => {
      try {
        const res = await axios.get(
          `http://localhost:9090/customer/follow/list?userId=${userId}`
        );

        // 예: res.data = [1, 3, 5]  (팔로우 중인 workshopId 목록)
        const initialStates = {};
        res.data.forEach((id) => {
          initialStates[id] = true;
        });
        setFollowStates(initialStates);
      } catch (err) {
        console.error("팔로우 목록 불러오기 실패:", err);
      }
    };

    if (userId) fetchFollows();
  }, [userId]);
  return (
    <button
      className={`follow-slide-btn ${
        followStates[workshop.workshopId] ? "following" : ""
      }`}
      onClick={(e) => handleFollowToggle(e, workshop.workshopId)}
    >
      {followStates[workshop.workshopId] ? "팔로잉" : "+ 팔로우"}
    </button>
  );
}
export default WorkshopAllFollowButton;
