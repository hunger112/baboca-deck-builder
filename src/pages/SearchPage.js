import React from "react";

const SearchPage = () => {
  const params = new URLSearchParams(window.location.search);
  const keyword = params.get("keyword");

  return (
    <div style={{ padding: 20 }}>
      <h2>カード検索結果ウィンドウ</h2>
      <p>検索キーワード：{keyword}</p>
    </div>
  );
};

export default SearchPage;
