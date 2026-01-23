import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../css/WorkshopInfo.css";
import { toast } from "react-toastify";
import { useAuth } from "../../App";
import ProgramCard from "../components/WorkshopInfo/ProgramCard";
import WorkshopCard from "../components/WorkshopInfo/WorkshopCard";

function WorkshopInfo() {
  const { user } = useAuth();
  const userId = user?.userId;

  const { id } = useParams();
  const [workshop, setWorkshop] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [following, setfollowing] = useState(false);
  const [totalFollows, setTotalFollows] = useState(0);
  const [countWish, setCountWish] = useState([]);
  const [workshopActive, setWorkshopActive] = useState();
  
  const hasLogged = useRef(false);

  useEffect(() => {
    if (!id || hasLogged.current) {
      return;
    }

    const sendVisitLog = async () => {
      try {
        hasLogged.current = true;

        await axios.post('http://localhost:9090/erp-system/visit-log', {
            workshopId: id,
            programId: null
        });
        console.log("방문 로그 전송 성공"); // 개발 중에만 확인용
      } catch (err) {
        console.error("방문 로그 저장 실패:", err);
      }
    };

    if (id) {
        sendVisitLog();
    }
  }, [])

  useEffect(() => {
    axios
      .get("http://localhost:9090/customer/workshop-info", {
        params: { workshopId: id, userId: userId },
      })
      .then((res) => {
        setWorkshop(res.data.workshop);
        setPrograms(res.data.programList);
        setfollowing(res.data.following);
        setTotalFollows(res.data.workshop.totalFollows);
        setWorkshopActive(res.data.workshop.active);
        console.log(res.data.workshop.active);

        if (res.data.programList) {
          const wishCounts = res.data.programList.map((p) => p.countWish || 0);
          setCountWish(wishCounts);
        }
      })
      .catch((err) => console.error("워크샵 정보 불러오기 오류:", err));
  }, [id, userId]);

  if (!workshop) return <p>로딩 중...</p>;

  // 팔로우 버튼 클릭 시
  const clickFollowBtn = () => {
    if (!userId) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    const followData = {
      userId,
      workshopId: id,
    };

    axios
      .post("http://localhost:9090/customer/follow/workshop-follow", followData)
      .then(() => {
        // 팔로우 상태 변경
        setfollowing((prev) => !prev);
        if (!following) {
          toast("🙋‍♀️ 공방을 팔로우했습니다.");
        } else {
          toast("✋ 공방 팔로우를 취소했습니다.");
        }

        // 팔로워 수 즉시 반영
        setTotalFollows((prevCount) =>
          following ? prevCount - 1 : prevCount + 1
        );
      })
      .catch((err) => console.error("팔로우 상태 변경 오류:", err));
  };

  // 하트 버튼 클릭 시
  const clickWishBtn = (programId, index) => {
    if (!userId) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    const wishData = { userId, programId };

    axios
      .post("http://localhost:9090/customer/wish/wish-program", wishData)
      .then((res) => {
        const active = res.data; // 서버에서 true/false 반환
        if (active) {
          toast("💖 위시리스트에 추가되었습니다.");
        } else {
          toast("🤍 위시리스트에서 삭제되었습니다.");
        }
        // programs 배열 업데이트 (찜 상태)
        setPrograms((prevPrograms) =>
          prevPrograms.map((p, i) =>
            i === index ? { ...p, wished: active } : p
          )
        );

        // countWish 배열 업데이트 (찜 수)
        setCountWish((prev) => {
          const updated = [...prev];
          updated[index] = active ? prev[index] + 1 : prev[index] - 1;
          return updated;
        });
      })
      .catch((err) => console.error("위시 상태 변경 오류:", err));
  };

  return (
    <div className="workshop-page">
      <Header />

      <div className="main-container">
        <div className="page-header">공방 소개</div>

        <WorkshopCard
          workshop={workshop}
          following={following}
          totalFollows={totalFollows}
          clickFollowBtn={clickFollowBtn}
        />

        <div className="workshop-info">
          {workshopActive ? (
            <div className="workshop-desc">{workshop.description}</div>
          ) : (
            <div className="workshop-desc">비활성화된 공방입니다.</div>
          )}
        </div>

        <ProgramCard
          programs={programs}
          workshop={workshop}
          clickWishBtn={clickWishBtn}
          countWish={countWish}
        />
      </div>
      <Footer />
    </div>
  );
}

export default WorkshopInfo;
