// src/pages/Home.js
import React, { useState, useEffect } from "react";

function Home() {
  const [keyword, setKeyword] = useState("");
  const [deck, setDeck] = useState([]);

  useEffect(() => {
    const savedDeck = localStorage.getItem("deck");
    if (savedDeck) {
      setDeck(JSON.parse(savedDeck));
    }

    const channel = new BroadcastChannel("deck_channel");
    channel.onmessage = (event) => {
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

    return () => channel.close();
  }, []);

  useEffect(() => {
    localStorage.setItem("deck", JSON.stringify(deck));
  }, [deck]);

  const handleSearch = () => {
    const encoded = encodeURIComponent(keyword);
    const base = window.location.origin + window.location.pathname;
    const url = `${base}#/search?keyword=${encoded}`;
    window.open(
      url,
      "searchWindow",
      "noopener,noreferrer,width=600,height=700,left=300,top=100"
    );
  };

  const handleOpenDeckView = () => {
    const totalCards = deck.reduce((sum, card) => sum + card.count, 0);
    if (totalCards > 40) {
      alert("デッキが40枚以上あります。40枚以下にしてください。");
      return;
    }
    localStorage.setItem("deckData", JSON.stringify(deck));

    const base = window.location.origin + window.location.pathname;
    const url = `${base}#/deck-view`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

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
      <div className="flex items-center mb-4">
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
      </div>

      <h2 className="text-xl font-bold mt-6 mb-2">
        現在のデッキ ({totalCards}枚)
      </h2>

      <div className="flex flex-wrap gap-4">
        {deck.map((card, i) => (
          <div
            key={i}
            // ✅ 高さ固定＋中央揃えで見た目安定
            className="bg-white p-3 rounded-lg shadow-md flex flex-col items-center w-[200px] h-[400px]"
          >
            {/* ✅ 画像 */}
            <div className="w-full h-[260px] overflow-hidden rounded-md bg-gray-100">
              <img
                src={card.image}
                alt={card.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='600'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='20'%3Eno image%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>

            {/* ✅ タイトル：自動折り返し＋2行固定 */}
            <p className="text-center mt-2 text-sm font-medium w-full break-words whitespace-normal leading-tight line-clamp-2 h-[3em]">
              {cleanCardName(card.name)}
            </p>

            {/* ✅ カウント調整 */}
            <div className="flex items-center mt-2 w-full justify-center">
              <button
                onClick={() => handleDecrease(i)}
                className="bg-gray-300 px-3 py-1 rounded-l"
              >
                −
              </button>
              <span className="px-4 bg-gray-100">{card.count}</span>
              <button
                onClick={() => handleIncrease(i)}
                className="bg-gray-300 px-3 py-1 rounded-r"
              >
                ＋
              </button>
            </div>

            <button
              onClick={() => handleRemove(i)}
              className="mt-3 bg-red-500 text-white px-4 py-1 rounded w-full"
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
