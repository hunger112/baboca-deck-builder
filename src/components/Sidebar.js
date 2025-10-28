// src/components/Sidebar.js
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 bg-orange-600 text-text-gray-800 flex flex-col min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-8">バボカBreak!!<br />デッキ作成サイト</h1>
      <nav className="space-y-4">
        <Link to="/" className="block hover:text-yellow-200">ホーム</Link>
        <Link to="/about" className="block hover:text-yellow-200">アプリについて</Link>
      </nav>
    </div>
  );
}

export default Sidebar;
