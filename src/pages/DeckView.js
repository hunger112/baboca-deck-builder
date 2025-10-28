import React, { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";

function DeckView() {
  const [deck, setDeck] = useState([]);
  const deckRef = useRef(null); // ← スクショ対象を参照

  useEffect(() => {
    const data = localStorage.getItem("deckData");
    if (data) setDeck(JSON.parse(data));
  }, []);

  if (!deck.length) {
    return <p className="text-center mt-10">デッキ情報がありません。</p>;
  }

  // 🖼️ デッキ全体を画像として保存
  const handleSaveAsImage = async () => {
    if (!deckRef.current) return;
    const canvas = await html2canvas(deckRef.current, {
      scale: 2, // 高解像度
      useCORS: true, // 外部画像読み込み対応
    });
    const link = document.createElement("a");
    link.download = "deck.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          デッキ一覧 ({deck.reduce((sum, c) => sum + c.count, 0)}枚)
        </h1>
        <button
          onClick={handleSaveAsImage}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          画像として保存
        </button>
      </div>

      <div
        ref={deckRef}
        className="bg-white p-6 rounded-lg shadow-md inline-block"
        style={{ maxWidth: "calc(130px * 8 + 16px * 7)" }} // 横8枚分のサイズ
      >
        <div className="grid grid-cols-8 gap-3">
          {deck.map((card, i) =>
            Array.from({ length: card.count }).map((_, j) => (
              <img
                key={`${i}-${j}`}
                src={card.image}
                alt={card.name}
                className="w-[130px] h-auto rounded shadow-sm"
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default DeckView;
