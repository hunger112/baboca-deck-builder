// src/pages/MainWindow.js
import React from "react";

function MainWindow({ deck, changeCardCount, removeCardFromDeck }) {
  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">デッキ内容</h2>

      {deck.length === 0 ? (
        <p className="text-gray-500">カードがまだ追加されていません。</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {deck.map((card) => (
            <div
              key={card.number}
              className="border rounded-lg p-2 bg-white shadow-sm text-center"
            >
              <img src={card.image} alt={card.name} className="w-full rounded mb-2" />
              <h3 className="font-semibold text-lg">{card.name}</h3>
              <div className="text-xs text-gray-500 mb-2">
                {card.number}（{card.set}・{card.category}）
              </div>

              {/* カウント操作 */}
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => changeCardCount(card.number, -1)}
                  className="bg-gray-300 px-2 py-1 rounded hover:bg-gray-400"
                >
                  −
                </button>
                <span className="font-bold">{card.count}</span>
                <button
                  onClick={() => changeCardCount(card.number, 1)}
                  className="bg-gray-300 px-2 py-1 rounded hover:bg-gray-400"
                >
                  ＋
                </button>
              </div>

              {/* 削除ボタン */}
              <button
                onClick={() => removeCardFromDeck(card.number)}
                className="mt-2 bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600"
              >
                削除
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MainWindow;
