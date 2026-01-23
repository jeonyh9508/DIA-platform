// src/workshop/components/ScheduleEdit.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

function ScheduleEdit({
  programId,
  duration,
  onUpdate,
  onCancel,
  today,
  initialDate,
  scheduleId,
  date,
  start,
  end,
  current,
  capacity,
}) {
  const editMode = scheduleId !== undefined;
  const [selectedDate, setSelectedDate] = useState(editMode ? date : "");
  const [newStartTime, setNewStartTime] = useState(editMode ? start : "");
  const [newCapacity, setNewCapacity] = useState(editMode ? capacity : 1);
  const [newEndTime, setNewEndTime] = useState(editMode ? end : "");

  useEffect(() => {
    if (!editMode) {
      setSelectedDate(initialDate);
    }
  }, [editMode, initialDate]);

  useEffect(() => {
    if (editMode && newStartTime === start) {
      setNewEndTime(end);
      return;
    }
    if (!newStartTime || !duration || duration <= 0) {
      setNewEndTime("");
      return;
    }

    const [hours, minutes] = newStartTime.split(":").map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    startDate.setMinutes(startDate.getMinutes() + duration);

    const endHours = String(startDate.getHours()).padStart(2, "0");
    const endMinutes = String(startDate.getMinutes()).padStart(2, "0");

    setNewEndTime(`${endHours}:${endMinutes}`);
  }, [newStartTime, duration, editMode, start, end]);

  const handleAddSubmit = (e) => {
    e.preventDefault();

    if (!selectedDate || !newStartTime || !newEndTime || newCapacity < 1) {
      alert("날짜, 시간, 정원을 올바르게 입력해주세요.");
      return;
    }

    const data = {
      programId: programId,
      startTime: `${selectedDate} ${newStartTime}:00`,
      endTime: `${selectedDate} ${newEndTime}:00`,
      capacity: newCapacity,
    };
    axios
      .post(`http://localhost:9090/workshop/program/schedule-add`, data)
      .then((res) => {
        if (res.status >= 200 && res.status < 300) {
          alert("일정이 등록되었습니다!");
          onUpdate(selectedDate);
          if (initialDate === "") {
            setSelectedDate("");
          }
          setNewStartTime("");
          setNewCapacity(1);
        } else {
          alert("일정 등록에 실패했습니다.");
        }
      })
      .catch((err) => {
        console.error("일정 등록 중 오류:", err);
        alert("일정 등록 중 통신 오류가 발생했습니다.");
      });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    if (!selectedDate || !newStartTime || !newEndTime || newCapacity < 1) {
      alert("날짜, 시간, 정원을 올바르게 입력해주세요.");
      return;
    }

    if (current > 0) {
      alert("예약한 인원이 존재해 수정이 불가능 합니다.");
      return;
    }

    const data = {
      scheduleId: scheduleId,
      programId: programId,
      startTime: `${selectedDate} ${newStartTime}:00`,
      endTime: `${selectedDate} ${newEndTime}:00`,
      capacity: newCapacity,
    };

    axios
      .post(`http://localhost:9090/workshop/program/schedule-modi`, data)
      .then((res) => {
        if (res.status >= 200 && res.status < 300) {
          alert("일정이 수정되었습니다!");
          onUpdate();
          if (onCancel) {
            onCancel();
          }
        } else {
          alert("일정 수정에 실패했습니다. (서버 응답 오류)");
        }
      })
      .catch((err) => {
        console.error("일정 수정 중 오류:", err);
        alert("일정 수정 중 통신 오류가 발생했습니다.");
      });
  };

  const handleDelete = () => {
    if (!window.confirm("정말로 이 일정을 삭제하시겠습니까?")) return;

    if (selectedDate >= today && current > 0) {
      alert("예약한 인원이 존재해 삭제가 불가능 합니다.");
      return;
    }

    axios
      .post(`http://localhost:9090/workshop/program/schedule-del`, {
        scheduleId: scheduleId,
      })
      .then((res) => {
        alert("일정이 삭제되었습니다.");
        onUpdate();
        if (onCancel) onCancel();
      })
      .catch((err) => {
        console.error("일정 삭제 오류:", err);
        alert("일정 삭제에 실패했습니다.");
      });
  };

  return (
    <>
      {editMode ? (
        <>
          <p className="ws-schedule-edit-attendees">현재 참석: {current}명</p>
          <form onSubmit={handleEditSubmit}>
            <div className="ws-schedule-form-inputs">
              <label>날짜:</label>
              <span className="ws-selected-date-text">{selectedDate}</span>
              <div className="ws-date-group">
                <input
                  type="time"
                  value={newStartTime}
                  onChange={(e) => setNewStartTime(e.target.value)}
                />
                <input
                  type="time"
                  value={newEndTime}
                  disabled
                  className="ws-disabled-input"
                />
              </div>
              <div className="ws-capacity-group">
                <label>정원 : </label>
                <input
                  type="number"
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(Number(e.target.value))}
                  min={current || 1}
                />
              </div>

              <div className="ws-btn-group">
                <button type="submit">수정</button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="ws-delete-button"
                >
                  삭제
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="ws-close-button"
                >
                  닫기
                </button>
              </div>
            </div>
          </form>
        </>
      ) : (
        <>
          <form onSubmit={handleAddSubmit}>
            <div className="ws-schedule-form-inputs">
              <label>날짜:</label>
              <input
                type="date"
                value={selectedDate}
                min={today}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
              />
              <input
                type="time"
                value={newStartTime}
                onChange={(e) => setNewStartTime(e.target.value)}
                required
              />
              <input
                type="time"
                value={newEndTime}
                disabled
                className="ws-disabled-input"
              />
              <label>정원 : </label>
              <input
                type="number"
                value={newCapacity}
                onChange={(e) => setNewCapacity(Number(e.target.value))}
                min="1"
                placeholder="정원"
                required
              />
              <button type="submit" disabled={!newEndTime || !selectedDate}>
                일정 등록
              </button>
            </div>
          </form>
        </>
      )}
    </>
  );
}

export default ScheduleEdit;
