import React from "react";
import ProgramsList from "./HomeProgramsList";
import WorkshopList from "./HomeWorkshopList";
import "../../css/HomeSlideSection.css";

function HomeSlideSection({ workshops, userId }) {
  return (
    <div>
      {/* === 슬라이드 프로그램 섹션 === */}
      <ProgramsList
        title="별점 높은 클래스 ⭐"
        sortOption="rating"
        userId={userId}
      />
      <ProgramsList
        title="새로운 클래스 💫"
        sortOption="latest"
        userId={userId}
      />
      <ProgramsList
        title="서울에서 열리는 클래스 ✨"
        region="서울"
        userId={userId}
      />
      <ProgramsList title="서예 클래스 🖌" category="서예" userId={userId} />
      <ProgramsList title="단체 클래스 👩‍👩‍👧‍👧" capacity="20" userId={userId} />
      <ProgramsList
        title="초급 클래스 🐣"
        difficultyList="초급"
        userId={userId}
      />
      <ProgramsList
        title="중급/고급 클래스 🎓"
        difficultyList={["중급", "고급"]}
        userId={userId}
      />
      <ProgramsList title="짧은 클래스 ⏱" durationMin="60" userId={userId} />

      {/* === 추천 공방 섹션 (추가된 부분) === */}
      <WorkshopList workshops={workshops} userId={userId} />
    </div>
  );
}

export default HomeSlideSection;
