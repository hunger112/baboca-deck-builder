// // src/data/mergedCards.js
// import cards from "./cards";
// import cardData from "./cardData";

// // カードデータと画像をマージ
// const mergedCards = cardData.map((card) => {
//   // ファイル名（拡張子抜き）と完全一致で検索
//   const imageMatch = cards.find((img) => img.name === card.number);

//   return {
//     ...card,
//     image: imageMatch ? imageMatch.image : null,
//   };
// });

// export default mergedCards;
// src/data/mergedCards.js
import cards from "./cards";
import cardData from "./cardData";

const mergedCards = cardData.map((card) => {
  const normalizedCardNumber = card.number?.trim().toLowerCase();
  const imageMatch = cards.find(
    (img) => img.name.trim().toLowerCase() === normalizedCardNumber
  );

  if (!imageMatch && normalizedCardNumber.includes("hv-p01-050-n")) {
    console.warn("⚠️ マッチしないカード:", card.number);
    console.log("cards側の候補:", cards.map((c) => c.name));
  }

  return {
    ...card,
    image: imageMatch ? imageMatch.image : null,
  };
});
// HV-P01-050-N がマージされているか確認
console.log(
  "🔎 HV-P01-050-N merged:",
  mergedCards.find((c) => c.number === "HV-P01-050-N")
);

// HV-P01-050-N がマージされているか確認
console.log(
  "🔎 HV-P01-049-N merged:",
  mergedCards.find((c) => c.number === "HV-P01-049-N")
);

export default mergedCards;
