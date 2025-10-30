// // src/data/cards.js
// function importAll(r) {
//   return r.keys().map((key, index) => ({
//     id: index + 1,
//     name: key
//       .replace("./", "")
//       .replace(/\.[^/.]+$/, ""), // 拡張子削除
//     image: r(key),
//   }));
// }

// const cards = importAll(
//   require.context("../assets/cards", false, /\.(png|jpe?g|webp)$/)
// );

// export default cards;
// src/data/cards.js
function importAll(r) {
  const imported = r.keys().map((key, index) => {
    const name = key
      .replace("./", "")
      .replace(/\.[^/.]+$/, ""); // 拡張子削除

    return {
      id: index + 1,
      name,
      image: r(key),
    };
  });

  // 🔍 確認用ログ
  console.log("📸 読み込まれた画像一覧:", imported.map((c) => c.name));

  return imported;
}

const cards = importAll(
  require.context("../assets/cards", false, /\.(png|jpe?g|webp)$/)
);

export default cards;
