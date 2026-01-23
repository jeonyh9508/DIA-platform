import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ProgramDatePicker = ({
  schedules,
  selectedDate,
  setSelectedDate,
  resetSelection,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // 커스텀 input
  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <input
      ref={ref}
      value={value}
      readOnly
      onClick={onClick}
      placeholder="날짜 선택"
      className="custom-date-input"
    />
  ));

  return (
    <DatePicker
      locale="ko"
      selected={selectedDate ? new Date(selectedDate) : null}
      onChange={(date) => {
        const formatted = date.toISOString().split("T")[0];
        setSelectedDate(formatted);
        resetSelection(); // 날짜 바꿀 때 선택값 초기화
        setIsOpen(false);
      }}
      dateFormat="yyyy-MM-dd"
      minDate={new Date()}
      placeholderText="날짜 선택"
      open={isOpen}
      onClickOutside={() => setIsOpen(false)}
      onInputClick={() => setIsOpen((prev) => !prev)}
      popperPlacement="bottom-start"
      portalId="root-portal"
      popperProps={{
        strategy: "fixed",
      }}
      customInput={<CustomInput />}
      dayClassName={(date) => {
        // 날짜를 YYYY-MM-DD 형식으로 맞추기
        const formatted = [
          date.getFullYear(),
          String(date.getMonth() + 1).padStart(2, "0"),
          String(date.getDate()).padStart(2, "0"),
        ].join("-");

        const today = new Date();
        const todayLocal = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );

        const isPast = date < todayLocal;

        // DB에서 일정이 존재하는 날짜만 하이라이트
        const hasSchedule = schedules.some((s) => {
          const dayStr = s.startTime.split(" ")[0];
          return dayStr === formatted;
        });

        if (isPast) return ""; // 빈 문자열 반환 (undefined 금지)
        return hasSchedule ? "highlight-day" : ""; // 항상 문자열 반환
      }}
      renderCustomHeader={({
        date,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      }) => (
        <div className="custom-calendar-header">
          <button
            onClick={decreaseMonth}
            disabled={prevMonthButtonDisabled}
            className="nav-button prev"
          >
            ◀
          </button>
          <span className="calendar-title">
            {date.getFullYear()}년 {date.getMonth() + 1}월
          </span>
          <button
            onClick={increaseMonth}
            disabled={nextMonthButtonDisabled}
            className="nav-button next"
          >
            ▶
          </button>
        </div>
      )}
    />
  );
};

export default ProgramDatePicker;
