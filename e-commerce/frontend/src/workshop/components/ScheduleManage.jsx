import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import ScheduleEdit from "./ScheduleEdit";
import "../css/ScheduleManage.css";
function ScheduleManage({ programId, onClose, userId }) {
  const [schedule, setSchedule] = useState([]);
  const [program, setProgram] = useState({});
  const [today, setToday] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectId, setSelectId] = useState(null);
  const [selectSchedule, setSelectSchedule] = useState(null);

  const fetchSchedules = useCallback(
    (date) => {
      axios
        .get(
          `http://localhost:9090/customer/program-info?programId=${programId}&userId=${userId}`
        )
        .then((res) => {
          setSchedule(res.data.scheduleList || []);
          setProgram(res.data.program || {});
          if (date) setSelectedDate(date);
        })
        .catch((err) => {
          console.error("일정 목록 로딩 오류:", err);
        });
    },
    [programId, userId]
  );

  useEffect(() => {
    fetchSchedules();
  }, [programId, fetchSchedules]);

  useEffect(() => {
    const date = new Date().toISOString().split("T")[0];
    setToday(date);
  }, [programId]);

  const filteredSchedules = schedule
    .filter((s) => s.active)
    .filter((s) => {
      return selectedDate === "" || s.startTime.split(" ")[0] === selectedDate;
    });

  const handleScheduleClick = (s) => {
    if (s.startTime < today) {
      alert("지난 일정은 수정이 불가합니다.");
      return;
    }

    if (s.scheduleId === selectId) {
      setSelectId(null);
      setSelectSchedule(null);
    } else {
      setSelectId(s.scheduleId);
      setSelectSchedule(s);
    }
  };

  const handleEditCancel = () => {
    setSelectId(null);
    setSelectSchedule(null);
  };

  return (
    <div className="ws-schedule-manage-container">
      <h3>{program.title} 스케줄 관리</h3>

      <div className="ws-select-date">
        <input
          type="date"
          value={selectedDate}
          min={today}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <button type="button" onClick={() => setSelectedDate("")}>
          전체 일정 보기
        </button>
      </div>

      <div className="ws-schedule-display-area">
        <div className="ws-schedule-box">
          {filteredSchedules.length > 0 ? (
            <div>
              {filteredSchedules.map((s) => (
                <div
                  key={s.scheduleId}
                  className={`ws-schedule-list ${
                    s.scheduleId === selectId ? "active" : ""
                  }`}
                  onClick={() => handleScheduleClick(s)}
                >
                  {s.startTime.split(" ")[1].substring(0, 5)} ~{" "}
                  {s.endTime.split(" ")[1].substring(0, 5)}
                  &nbsp; (날짜: {s.startTime.split(" ")[0]})
                  <span className="ws-schedule-capacity">
                    정원: {s.currentAttendees}/{s.capacity}명
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p>선택하신 날짜에 개설된 일정이 없습니다.</p>
          )}
        </div>

        {selectSchedule && (
          <div className="ws-selected-schedule-detail-box active-detail">
            <ScheduleEdit
              duration={program.durationMin}
              onUpdate={fetchSchedules}
              onCancel={handleEditCancel}
              today={today}
              scheduleId={selectSchedule.scheduleId}
              start={selectSchedule.startTime.split(" ")[1].substring(0, 5)}
              end={selectSchedule.endTime.split(" ")[1].substring(0, 5)}
              date={selectSchedule.startTime.split(" ")[0]}
              current={selectSchedule.currentAttendees}
              capacity={selectSchedule.capacity}
            />
          </div>
        )}
      </div>

      <div className="ws-schedule-form-container">
        <h4>일정 등록 (예상 소요 시간: {program.durationMin || "??"}분)</h4>
        <ScheduleEdit
          programId={programId}
          duration={program.durationMin}
          onUpdate={fetchSchedules}
          today={today}
          initialDate={selectedDate}
        />
      </div>
    </div>
  );
}
export default ScheduleManage;
