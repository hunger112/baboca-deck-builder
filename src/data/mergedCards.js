// src/data/mergedCards.js
import cards from "./cards";
import cardData from "./cardData";

// カードデータと画像をマージ
const mergedCards = cardData.map((card) => {
  // ファイル名（拡張子抜き）と完全一致で検索
  const imageMatch = cards.find((img) => img.name === card.number);

  return {
    ...card,
    image: imageMatch ? imageMatch.image : null,
  };
});

export default mergedCards;
