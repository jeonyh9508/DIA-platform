import React from "react";
import { toast } from "react-toastify";

function ErpQnaFilters({ handleChange, filters }) {
  // 날짜 검증 전용 래퍼 함수
  const handleDateChange = (e) => {
    const { name, value } = e.target;

    // 두 날짜 모두 존재할 때만 비교
    const start = name === "startDate" ? value : filters.startDate;
    const end = name === "endDate" ? value : filters.endDate;

    // 날짜가 둘 다 있으면 비교
    if (start && end) {
      if (new Date(end) < new Date(start)) {
        toast.error("종료일은 시작일보다 빠를 수 없습니다.");
        return; // 값 변경을 막기
      }
    }

    // 통과했으면 원래 handleChange 호출
    handleChange(e);
  };

  return (
    <div className="erp-qna-filters">
      <table>
        <thead>
          <tr>
            {/* ===== 역할 ===== */}
            <th>고객</th>
            <td>
              <label className="radio-item">
                <input
                  type="radio"
                  name="role"
                  value=""
                  checked={filters.role === ""}
                  onChange={handleChange}
                />
                <span>전체</span>
              </label>

              <label className="radio-item">
                <input
                  type="radio"
                  name="role"
                  value="CUSTOMER"
                  checked={filters.role === "CUSTOMER"}
                  onChange={handleChange}
                />
                <span>일반 고객</span>
              </label>

              <label className="radio-item">
                <input
                  type="radio"
                  name="role"
                  value="WORKSHOP"
                  checked={filters.role === "WORKSHOP"}
                  onChange={handleChange}
                />
                <span>공방 고객</span>
              </label>
            </td>
            {/* ===== 답변 상태 ===== */}
            <th>상태</th>
            <td>
              <label className="radio-item">
                <input
                  type="radio"
                  name="status"
                  value=""
                  checked={filters.status === ""}
                  onChange={handleChange}
                />
                <span>전체</span>
              </label>

              <label className="radio-item">
                <input
                  type="radio"
                  name="status"
                  value="대기"
                  checked={filters.status === "대기"}
                  onChange={handleChange}
                />
                <span>대기</span>
              </label>

              <label className="radio-item">
                <input
                  type="radio"
                  name="status"
                  value="답변완료"
                  checked={filters.status === "답변완료"}
                  onChange={handleChange}
                />
                <span>답변 완료</span>
              </label>
            </td>
            {/* ===== 날짜 ===== */}
            <th>기간</th>
            <td>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleDateChange}
              />
              ~
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleDateChange}
              />
            </td>
          </tr>

          <tr>
            {/* ===== 키워드 검색 ===== */}
            <th>검색</th>
            <td colSpan="5">
              <input
                type="text"
                name="keyword"
                placeholder="이름/이메일/제목/내용 검색"
                onChange={handleChange}
                value={filters.keyword}
              />
            </td>
          </tr>
        </thead>
      </table>
    </div>
  );
}

export default ErpQnaFilters;
