// src/data/cards.js
function importAll(r) {
  return r.keys().map((key, index) => ({
    id: index + 1,
    name: key
      .replace("./", "")
      .replace(/\.[^/.]+$/, ""), // 拡張子削除
    image: r(key),
  }));
}

const cards = importAll(
  require.context("../assets/cards", false, /\.(png|jpe?g|webp)$/)
);

export default cards;
