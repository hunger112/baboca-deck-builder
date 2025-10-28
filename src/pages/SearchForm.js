import React, { useState, useEffect } from "react";

function SearchForm() {
  const [keyword, setKeyword] = useState("");
  const [deck, setDeck] = useState([]);

  // 🔍 検索ボタン押下
  const handleSearch = () => {
    const searchUrl = `/search?keyword=${encodeURIComponent(keyword)}`;
    window.open(searchUrl, "searchWindow", "width=500,height=600");
  };

  // 📩 検索ウィンドウからカード追加
  useEffect(() => {
    const handleMessage = (event) => {
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

  // ➕ 枚数を増やす
  const incrementCount = (number) => {
    setDeck((prev) =>
      prev.map((c) =>
        c.number === number ? { ...c, count: c.count + 1 } : c
      )
    );
  };

  // ➖ 枚数を減らす（0以下にはならない）
  const decrementCount = (number) => {
    setDeck((prev) =>
      prev.map((c) =>
        c.number === number
          ? { ...c, count: Math.max(c.count - 1, 0) }
          : c
      )
    );
  };

  // 🔢 枚数を手入力で変更
  const handleCountChange = (number, value) => {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 0) return;
    setDeck((prev) =>
      prev.map((c) => (c.number === number ? { ...c, count: num } : c))
    );
  };

  // ❌ カード削除
  const removeCard = (number) => {
    setDeck((prev) => prev.filter((c) => c.number !== number));
  };

  // 🧮 合計枚数を計算
  const totalCards = deck.reduce((sum, card) => sum + card.count, 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">カード検索</h2>

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="キーワードを入力"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md transition"
        >
          検索
        </button>
      </div>

      <div className="mt-8">
        {/* 🔹 合計枚数をここに追加 */}
        <h3 className="text-xl font-semibold mb-4">
          現在のデッキ{" "}
          {deck.length > 0 && (
            <span className="text-gray-600 text-lg">（{totalCards}枚）</span>
          )}
        </h3>

        {deck.length === 0 ? (
          <p className="text-gray-500">まだカードが追加されていません。</p>
        ) : (
          <div className="grid grid-cols-8 gap-2">
            {deck.map((card) => (
              <div
                key={card.number}
                className="border rounded-lg p-2 bg-white shadow text-center hover:shadow-md transition"
              >
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-full h-auto rounded mb-1 object-contain"
                  style={{ maxHeight: "140px" }}
                />
                <p className="font-semibold text-xs mb-1">
                 {card.name.replace(/_[A-Za-z0-9]+$/, "")}
                </p>

                {/* ▼ 枚数操作エリア */}
                <div className="flex items-center justify-center gap-1 mb-1">
                  <button
                    onClick={() => decrementCount(card.number)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded px-2 py-0.5 text-xs"
                  >
                    −
                  </button>

                  <input
                    type="number"
                    min="0"
                    value={card.count}
                    onChange={(e) =>
                      handleCountChange(card.number, e.target.value)
                    }
                    className="w-10 text-center border border-gray-300 rounded text-xs"
                  />

                  <button
                    onClick={() => incrementCount(card.number)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded px-2 py-0.5 text-xs"
                  >
                    ＋
                  </button>
                </div>

                <button
                  onClick={() => removeCard(card.number)}
                  className="bg-red-500 hover:bg-red-600 text-white rounded px-2 py-0.5 text-xs"
                >
                  削除
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchForm;
