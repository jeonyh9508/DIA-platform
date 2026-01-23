import React from "react";
function MyQnaFilters({ filteredQnas, showAnsweredOnly, setShowAnsweredOnly }) {
  return (
    <table>
      <tbody>
        <tr>
          <td width="120px">
            {filteredQnas.length > 0 && (
              <p className="content-count">
                {filteredQnas.length}개의 문의 내역
              </p>
            )}
          </td>

          <td width="150px">
            <label className="answered-toggle">
              <input
                type="checkbox"
                checked={showAnsweredOnly}
                onChange={() => setShowAnsweredOnly(!showAnsweredOnly)}
              />
              <span>답변완료만 보기</span>
            </label>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
export default MyQnaFilters;
