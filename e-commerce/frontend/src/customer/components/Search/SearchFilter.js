import axios from "axios";
import React, { useEffect, useState } from "react";
import "../../css/Header.css";

function SearchFilter({ filters, setFilters }) {
  const { region, category, capacity, durationMin, minPrice, maxPrice } =
    filters;
  const [categories, setCategories] = useState([]);
  // 필드 값 변경, 값이 바뀔 때 호출
  // key: 필드명 / value: 선택 또는 입력된 값
  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // 난이도 필터 클릭 핸들러 : 배열 형태의 difficultyList를 토글 방식으로 업데이트
  const handleDifficultyClick = (level) => {
    setFilters((prev) => {
      const list = Array.isArray(prev.difficultyList)
        ? prev.difficultyList
        : []; // 혹시 문자열일 경우 안전하게 배열로 변경
      const isSelected = list.includes(level);
      const updated = isSelected
        ? list.filter((l) => l !== level) // 선택 해제
        : [...list, level]; // 새로 추가
      return { ...prev, difficultyList: updated };
    });
  };

  // 카테고리 데이터 불러오기
  useEffect(() => {
    axios
      .get("http://localhost:9090/customer/home")
      .then((res) => {
        setCategories(res.data.categories);
      })
      .catch((err) => console.error("홈 데이터 불러오기 오류:", err));
  }, []);

  // 지역 목록
  const regions = [
    "서울",
    "부산",
    "인천",
    "대구",
    "울산",
    "광주",
    "대전",
    "세종",
    "경기",
    "강원",
    "충북",
    "충남",
    "전북",
    "전남",
    "경북",
    "경남",
    "제주",
  ];

  return (
    <table>
      <tbody>
        <tr>
          <th>
            <label>지역</label>
          </th>
          <td>
            <select
              value={region}
              onChange={(e) => handleChange("region", e.target.value)}
            >
              <option value="">전체</option>
              {regions.map((reg, index) => (
                <option value={reg} key={index}>
                  {reg}
                </option>
              ))}
            </select>
          </td>
          <th>
            <label>인원</label>
          </th>
          <td>
            <select
              value={capacity}
              onChange={(e) => handleChange("capacity", Number(e.target.value))}
            >
              <option value="">선택 안함</option>
              {[...Array(9).keys()].map((i) => (
                <option key={i} value={i + 1}>
                  {i + 1}명
                </option>
              ))}
              <option value="10">10명 이상</option>
              <option value="20">20명 이상</option>
              <option value="30">30명 이상</option>
            </select>
          </td>
        </tr>

        <tr>
          <th>
            <label>카테고리</label>
          </th>
          <td>
            <select
              value={category}
              onChange={(e) => handleChange("category", e.target.value)}
            >
              <option value="">전체</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </td>

          <th>
            <label>난이도</label>
          </th>
          <td>
            <div className="level-button-field">
              {["초급", "중급", "고급"].map((level) => (
                <input
                  type="button"
                  key={level}
                  className={`level-button ${
                    (filters.difficultyList || []).includes(level)
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => handleDifficultyClick(level)}
                  value={level}
                />
              ))}
            </div>
          </td>
        </tr>

        <tr>
          <th>
            <label>가격</label>
          </th>
          <td>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="최소"
                min="0" // 음수 방지
                value={minPrice}
                onChange={(e) =>
                  handleChange("minPrice", Number(e.target.value))
                }
              />
              <span>~</span>
              <input
                type="number"
                placeholder="최대"
                min="0" // 음수 방지
                value={maxPrice}
                onChange={(e) =>
                  handleChange("maxPrice", Number(e.target.value))
                }
              />
            </div>
          </td>
          <th>
            <label>소요 시간</label>
          </th>
          <td>
            <select
              value={durationMin}
              onChange={(e) =>
                handleChange("durationMin", Number(e.target.value))
              }
            >
              <option value="">선택 안함</option>
              <option value="60">0 ~ 60분</option>
              <option value="120">61 ~ 120분</option>
              <option value="180">121 ~ 180분</option>
              <option value="181">181분 ~</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
export default SearchFilter;
