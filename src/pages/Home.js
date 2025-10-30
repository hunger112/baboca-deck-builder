// src/pages/Home.js
import React, { useState, useEffect } from "react";

function Home() {
  const [keyword, setKeyword] = useState("");
  const [deck, setDeck] = useState([]);

  // 🔹 ローカルストレージから初期デッキを読み込み
  useEffect(() => {
    const savedDeck = localStorage.getItem("deck");
    if (savedDeck) {
      setDeck(JSON.parse(savedDeck));
    }

    // 🔹 検索ウィンドウからカード追加
    const handleMessage = (event) => {
      // ✅ セキュリティ: 同一オリジンチェック
      if (event.origin !== window.location.origin) return;

      if (event.data.type === "ADD_CARD_TO_DECK") {
        const card = event.data.card;
        setDeck((prev) => {
          const existing = prev.find((c) => c.number === card.number);
          if (existing) {
            return prev.map((c) =>
              c.number === card.number ? { ...c, count: c.count + 1 } : c
            );
          }
          return [...prev, { ...card, count: 1 }];
        });
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // 🔹 デッキをlocalStorageに保存
  useEffect(() => {
    localStorage.setItem("deck", JSON.stringify(deck));
  }, [deck]);

  // ✅ GitHub Pages + HashRouter対応 検索ボタン（安全版）
  const handleSearch = () => {
    const encoded = encodeURIComponent(keyword);
    const base = window.location.origin + window.location.pathname;
    const url = `${base}#/search?keyword=${encoded}`;
    // ⚠️ 警告回避: "noopener,noreferrer" を追加
    window.open(
      url,
      "searchWindow",
      "noopener,noreferrer,width=600,height=700,left=300,top=100"
    );
  };

  // ✅ デッキ出力（安全版）
  const handleOpenDeckView = () => {
    const totalCards = deck.reduce((sum, card) => sum + card.count, 0);
    if (totalCards > 40) {
      alert("デッキが40枚以上あります。40枚以下にしてください。");
      return;
    }
    localStorage.setItem("deckData", JSON.stringify(deck));

    const base = window.location.origin + window.location.pathname;
    const url = `${base}#/deck-view`;
    // ⚠️ 警告回避: "noopener,noreferrer" を追加
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // 🔹 カウント操作
  const handleIncrease = (index) => {
    const newDeck = [...deck];
    newDeck[index].count += 1;
    setDeck(newDeck);
  };

  const handleDecrease = (index) => {
    const newDeck = [...deck];
    if (newDeck[index].count > 1) newDeck[index].count -= 1;
    setDeck(newDeck);
  };

  const handleRemove = (index) => {
    const newDeck = deck.filter((_, i) => i !== index);
    setDeck(newDeck);
  };

  const totalCards = deck.reduce((sum, card) => sum + card.count, 0);
  const cleanCardName = (name) => name.replace(/_\d+$/, "");

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-3">カード検索</h1>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="キーワードを入力"
        className="border rounded p-2 mr-2"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        検索
      </button>

      {/* 現在のデッキ */}
      <h2 className="text-xl font-bold mt-6 mb-2">
        現在のデッキ ({totalCards}枚)
      </h2>

      <div className="flex flex-wrap gap-4">
        {deck.map((card, i) => (
          <div
            key={i}
            className="bg-white p-2 rounded-lg shadow-md flex flex-col items-center"
          >
            <img
              src={card.image}
              alt={card.name}
              className="w-[150px] h-auto rounded-md"
            />
            <p className="text-center mt-1 text-sm font-medium">
              {cleanCardName(card.name)}
            </p>

            {/* ＋−ボタンと削除 */}
            <div className="flex items-center mt-2">
              <button
                onClick={() => handleDecrease(i)}
                className="bg-gray-300 px-2 py-1 rounded-l"
              >
                −
              </button>
              <span className="px-3">{card.count}</span>
              <button
                onClick={() => handleIncrease(i)}
                className="bg-gray-300 px-2 py-1 rounded-r"
              >
                ＋
              </button>
            </div>

            <button
              onClick={() => handleRemove(i)}
              className="mt-2 bg-red-500 text-white px-4 py-1 rounded"
            >
              削除
            </button>
          </div>
        ))}
      </div>

      {deck.length > 0 && totalCards <= 40 && (
        <button
          onClick={handleOpenDeckView}
          className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          デッキ画像出力
        </button>
      )}
    </div>
  );
}

export default Home;
