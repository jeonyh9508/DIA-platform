import React from "react";

function CategoryNav({
  navigate,
  setSelectedCategory,
  selectedCategory,
  categories,
  categoryLink,
  categoryIcons,
}) {
  return (
    <nav className="category-nav">
      <button
        className="category-button"
        onClick={() => {
          navigate("/customer/search");
          setSelectedCategory("All 전체");
        }}
      >
        <span className="category-icon">All</span>
        <span>전체</span>
      </button>
      {/* DB: 이 부분에서 '카테고리' 목록 데이터를 DB에서 불러옵니다. */}
      {categories.map((category) => (
        <button
          key={category}
          className={`category-button ${
            selectedCategory === category ? "active" : ""
          }`}
          onClick={() => categoryLink(category)}
        >
          <span className="category-icon">{categoryIcons[category]}</span>
          <span>{category}</span>
        </button>
      ))}
    </nav>
  );
}
export default CategoryNav;
