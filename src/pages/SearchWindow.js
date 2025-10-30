// src/pages/SearchWindow.js
import React, { useState, useEffect } from "react";
import mergedCards from "../data/mergedCards";

function SearchWindow() {
  // ✅ GitHub Pages + HashRouter対応：URLからkeyword取得
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

  // ✅ ハッシュ変更時に検索キーワードを再取得
  useEffect(() => {
    const handleHashChange = () => {
      setKeyword(getKeywordFromHash());
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const statMap = {
    サーブ: "サーブ",
    レシーブ: "レシーブ",
    トス: "トス",
    アタック: "アタック",
    ブロック: "ブロック",
  };

  // ✅ 弾順の優先順位を定義
  const setOrder = {
    "HV-P01": 1,
    "HV-D01": 2,
    "HV-D02": 3,
    "HV-PR": 4,
    "HVBP": 5,
  };

  // 🔍 フィルタ処理
  const filteredCards = mergedCards.filter((card) => {
    // ✅ 全フィルタ未指定なら全件表示
    if (!keyword && !category && !team && !setName && !minStat && !maxStat) {
      return true;
    }

    // ✅ 正規化関数（全角ハイフン対策）
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

    // ✅ 能力値フィルタ処理（入力がなければスキップ）
    const statKey = statMap[statType];
    const statValueRaw = card.stats?.[statKey];
    const statValue =
      statValueRaw === "-" || statValueRaw === undefined
        ? null
        : Number(statValueRaw);
    const hasRange = minStat !== "" || maxStat !== "";

    if (!hasRange) {
      // → 能力値条件を完全にスキップ
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

  // ✅ 弾ごとにソート（setOrderに従う）
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
    // 🔽 弾の並び順をsetOrderに従ってソート
    .sort(([aKey], [bKey]) => (setOrder[aKey] || 999) - (setOrder[bKey] || 999))
    // 🔽 各弾の中で番号順にソート
    .flatMap(([_, cardsInSet]) =>
      cardsInSet.sort((a, b) => {
        const aNum = parseInt(a.number?.match(/-(\d+)-?/)?.[1] || 0, 10);
        const bNum = parseInt(b.number?.match(/-(\d+)-?/)?.[1] || 0, 10);
        return aNum - bNum;
      })
    );

  // ✅ ページネーション処理
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
    const targetOrigin = window.location.hostname.includes("localhost")
      ? "http://localhost:3000"
      : "https://hunger112.github.io";

    window.opener.postMessage({ type: "ADD_CARD_TO_DECK", card }, targetOrigin);
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

          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentPage(i + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" }); // ← これを追加！
                  }}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                    }`}>
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
