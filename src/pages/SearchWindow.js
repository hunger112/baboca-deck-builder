// src/pages/SearchWindow.js
import React, { useState, useEffect, useRef } from "react";
import mergedCards from "../data/mergedCards";

function SearchWindow() {
  // ✅ BroadcastChannel（安全に管理するためuseRef使用）
  const channelRef = useRef(null);

  useEffect(() => {
    channelRef.current = new BroadcastChannel("deck_channel");
    return () => {
      channelRef.current?.close();
      channelRef.current = null;
    };
  }, []);

  // ✅ URLハッシュからkeyword取得（GitHub Pages + HashRouter対応）
  const getKeywordFromHash = () => {
    const hash = window.location.hash; // 例: "#/search?keyword=影山"
    const query = hash.includes("?") ? hash.split("?")[1] : "";
    const params = new URLSearchParams(query);
    return params.get("keyword") || "";
  };

  const [keyword, setKeyword] = useState(getKeywordFromHash());
  const [category, setCategory] = useState("");
  const [team, setTeam] = useState("");
  const [setName, setSetName] = useState("");
  const [statType, setStatType] = useState("サーブ");
  const [minStat, setMinStat] = useState("");
  const [maxStat, setMaxStat] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ ハッシュ変更時にkeywordを再取得
  useEffect(() => {
    const handleHashChange = () => {
      setKeyword(getKeywordFromHash());
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // 能力値マップ
  const statMap = {
    サーブ: "サーブ",
    レシーブ: "レシーブ",
    トス: "トス",
    アタック: "アタック",
    ブロック: "ブロック",
  };

  // 弾順序の定義
  const setOrder = {
    "HV-P01": 1,
    "HV-D01": 2,
    "HV-D02": 3,
    "HV-PR": 4,
    "HVBP": 5,
  };

  // 🔍 絞り込み処理
  const filteredCards = mergedCards.filter((card) => {
    if (!keyword && !category && !team && !setName && !minStat && !maxStat) {
      return true;
    }

    const normalize = (text) =>
      text
        ?.toLowerCase()
        .replace(/[‐-‒–—―ー−－]/g, "-")
        .replace(/\s+/g, "") || "";

    const lowerKeyword = normalize(keyword);

    const keywordMatch =
      (card.name && normalize(card.name).includes(lowerKeyword)) ||
      (card.number && normalize(card.number).includes(lowerKeyword));

    const categoryMatch = category ? card.category === category : true;
    const teamMatch = team ? card.team?.includes(team) : true;
    const setMatch = setName ? card.set === setName : true;

    const statKey = statMap[statType];
    const statValueRaw = card.stats?.[statKey];
    const statValue =
      statValueRaw === "-" || statValueRaw === undefined
        ? null
        : Number(statValueRaw);
    const hasRange = minStat !== "" || maxStat !== "";

    if (!hasRange) {
      return keywordMatch && categoryMatch && teamMatch && setMatch;
    }

    const min = minStat !== "" ? Number(minStat) : -Infinity;
    const max = maxStat !== "" ? Number(maxStat) : Infinity;

    const statMatch =
      statValue !== null && !isNaN(statValue)
        ? statValue >= min && statValue <= max
        : false;

    return keywordMatch && categoryMatch && teamMatch && setMatch && statMatch;
  });

  // ✅ 弾ごとに並び替え
  const groupedAndSortedCards = Object.entries(
    filteredCards.reduce((acc, card) => {
      const prefix =
        Object.keys(setOrder).find((key) => card.number?.startsWith(key)) ||
        "ZZZ";
      if (!acc[prefix]) acc[prefix] = [];
      acc[prefix].push(card);
      return acc;
    }, {})
  )
    .sort(([aKey], [bKey]) => (setOrder[aKey] || 999) - (setOrder[bKey] || 999))
    .flatMap(([_, cardsInSet]) =>
      cardsInSet.sort((a, b) => {
        const aNum = parseInt(a.number?.match(/-(\d+)-?/)?.[1] || 0, 10);
        const bNum = parseInt(b.number?.match(/-(\d+)-?/)?.[1] || 0, 10);
        return aNum - bNum;
      })
    );

  // ✅ ページネーション処理
  const cardsPerPage = 20;
  const indexOfLast = currentPage * cardsPerPage;
  const indexOfFirst = indexOfLast - cardsPerPage;
  const currentCards = groupedAndSortedCards.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(groupedAndSortedCards.length / cardsPerPage);

  // ✅ ページ・フィルタ変更時リセット
  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, category, team, setName, statType, minStat, maxStat]);

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

  // ✅ Homeへ安全にカード送信
  const handleCardClick = (card) => {
    if (channelRef.current) {
      try {
        channelRef.current.postMessage({ type: "ADD_CARD_TO_DECK", card });
      } catch (err) {
        console.warn("BroadcastChannel error:", err);
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">検索結果</h2>

      {/* フィルタフォーム */}
      <div className="mb-6 space-y-3">
        <div>
          <label className="block font-semibold mb-1">カード名検索</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="例: 影山 または HV-P01-050-N"
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
              <option value="鴎台">鴎台</option>
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

          {/* ページネーション */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentPage(i + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
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
