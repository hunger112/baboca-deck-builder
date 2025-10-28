// src/pages/SearchWindow.js
import React, { useState, useEffect } from "react";
import mergedCards from "../data/mergedCards";

function SearchWindow() {
  const params = new URLSearchParams(window.location.search);
  const initialKeyword = params.get("keyword") || "";

  const [keyword, setKeyword] = useState(initialKeyword);
  const [category, setCategory] = useState("");
  const [team, setTeam] = useState("");
  const [setName, setSetName] = useState("");
  const [statType, setStatType] = useState("サーブ");
  const [minStat, setMinStat] = useState("");
  const [maxStat, setMaxStat] = useState("");

  const statMap = {
    サーブ: "サーブ",
    レシーブ: "レシーブ",
    トス: "トス",
    アタック: "アタック",
    ブロック: "ブロック",
  };

  const setOrder = {
    "HV-P01": 1,
    "HV-D01": 2,
    "HV-D02": 3,
    "HV-PR": 4,
    "HVBP": 5,
  };

  // フィルタ処理
  const filteredCards = mergedCards.filter((card) => {
    const keywordMatch = card.name?.toLowerCase().includes(keyword.toLowerCase());
    const categoryMatch = category ? card.category === category : true;
    const teamMatch = team ? card.team?.includes(team) : true;
    const setMatch = setName ? card.set === setName : true;

    const statKey = statMap[statType];
    const statValue = card.stats?.[statKey];
    const hasMin = minStat !== "";
    const hasMax = maxStat !== "";
    const min = hasMin ? Number(minStat) : -Infinity;
    const max = hasMax ? Number(maxStat) : Infinity;

    let statMatch = true;
    if (hasMin || hasMax) {
      if (statValue !== undefined && statValue !== null && !isNaN(statValue)) {
        statMatch = statValue >= min && statValue <= max;
      } else {
        statMatch = false;
      }
    }

    return keywordMatch && categoryMatch && teamMatch && setMatch && statMatch;
  });

  // 弾ごとにソート
  const groupedAndSortedCards = Object.values(
    filteredCards.reduce((acc, card) => {
      const prefix = Object.keys(setOrder).find((key) =>
        card.number?.startsWith(key)
      ) || "ZZZ"; // 未登録弾は最後に
      if (!acc[prefix]) acc[prefix] = [];
      acc[prefix].push(card);
      return acc;
    }, {})
  ).flatMap((cardsInSet) =>
    cardsInSet.sort((a, b) => {
  const aNum = parseInt(a.number?.match(/-(\d+)-?/)?.[1] || 0, 10);
  const bNum = parseInt(b.number?.match(/-(\d+)-?/)?.[1] || 0, 10);
  return aNum - bNum;
})
  );

  const cardsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, category, team, setName, statType, minStat, maxStat]);

  const indexOfLast = currentPage * cardsPerPage;
  const indexOfFirst = indexOfLast - cardsPerPage;
  const currentCards = groupedAndSortedCards.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(groupedAndSortedCards.length / cardsPerPage);

  const resetFilters = () => {
    setKeyword("");
    setCategory("");
    setTeam("");
    setSetName("");
    setStatType("サーブ");
    setMinStat("");
    setMaxStat("");
    setCurrentPage(1);
  };

  const handleCardClick = (card) => {
    if (window.opener) {
      window.opener.postMessage(
        { type: "ADD_CARD_TO_DECK", card },
        window.location.origin
      );
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">検索結果</h2>

      {/* 絞り込みフォーム */}
      <div className="mb-6 space-y-3">
        <div>
          <label className="block font-semibold mb-1">カード名検索</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="例: 影山"
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block font-semibold mb-1">カテゴリ</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">すべて</option>
              <option value="キャラ">キャラ</option>
              <option value="イベント">イベント</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">高校（チーム）</label>
            <select
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">すべて</option>
              <option value="烏野">烏野</option>
              <option value="青葉城西">青葉城西</option>
              <option value="音駒">音駒</option>
              <option value="梟谷">梟谷</option>
              <option value="稲荷崎">稲荷崎</option>
              <option value="井闥山">井闥山</option>
              <option value="鷗台">鷗台</option>
              <option value="その他">その他</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">収録弾</label>
            <select
              value={setName}
              onChange={(e) => setSetName(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">すべて</option>
              <option value="スターター">スターター</option>
              <option value="第一弾">第一弾</option>
              <option value="第二弾">第二弾</option>
              <option value="PR">PR</option>
              <option value="体験版">体験版</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block font-semibold mb-1">能力値</label>
            <select
              value={statType}
              onChange={(e) => setStatType(e.target.value)}
              className="border p-2 rounded"
            >
              {Object.keys(statMap).map((label) => (
                <option key={label} value={label}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-600 text-sm">最小</label>
            <input
              type="number"
              value={minStat}
              onChange={(e) => setMinStat(e.target.value)}
              className="border p-2 rounded w-20"
            />
          </div>
          <span>〜</span>
          <div>
            <label className="block text-gray-600 text-sm">最大</label>
            <input
              type="number"
              value={maxStat}
              onChange={(e) => setMaxStat(e.target.value)}
              className="border p-2 rounded w-20"
            />
          </div>

          <button
            onClick={resetFilters}
            className="ml-4 bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-2 rounded"
          >
            リセット
          </button>
        </div>
      </div>

      {/* 検索結果 */}
      {groupedAndSortedCards.length === 0 ? (
        <p>該当するカードが見つかりません。</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            {currentCards.map((card, index) => (
              <div
                key={`${card.number || card.name}-${index}`}
                onClick={() => handleCardClick(card)}
                className="border border-gray-300 rounded-lg p-2 text-center shadow-sm hover:shadow-md transition cursor-pointer"
              >
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-full rounded mb-2"
                />
                <h3 className="text-lg font-semibold">
                  {card.name.replace(/_\d+$/, "")}
                </h3>
                <div className="text-xs text-gray-500">
                  {card.number}（{card.set}・{card.category}）
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default SearchWindow;
