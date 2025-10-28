import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-56 bg-gray-800 text-white flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-6">バボカBreak！！デッキ作成サイト</h1>
      <ul className="space-y-3">
        <li>
          <Link
            to="/"
            className="block px-3 py-2 rounded hover:bg-gray-700 transition"
          >
            ホーム
          </Link>
        </li>
        <li>
          <Link
            to="/deck"
            className="block px-3 py-2 rounded hover:bg-gray-700 transition"
          >
            デッキビルダー
          </Link>
        </li>
        <li>
          <Link
            to="/about"
            className="block px-3 py-2 rounded hover:bg-gray-700 transition"
          >
            アプリについて
          </Link>
        </li>
      </ul>
    </nav>
  );
}
