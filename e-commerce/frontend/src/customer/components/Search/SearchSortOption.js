import React from "react";

function SearchSortOption({ sortOption, setSortOption, location, navigate }) {
  return (
    <select
      className="sort-select"
      value={sortOption}
      onChange={(e) => {
        const newSort = e.target.value;
        setSortOption(newSort);
        const params = new URLSearchParams(location.search);
        params.set("sortOption", newSort);
        navigate(`/customer/search?${params.toString()}`);
      }}
    >
      <option value="latest">최신순</option>
      <option value="rating">별점순</option>
      <option value="price-desc">가격 높은 순</option>
      <option value="price-asc">가격 낮은 순</option>
      <option value="long-time">소요시간 긴 순</option>
      <option value="short-time">소요시간 짧은 순</option>
    </select>
  );
}
export default SearchSortOption;
