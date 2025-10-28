// src/App.js
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
//import SearchForm from "./pages/SearchForm";
import SearchWindow from "./pages/SearchWindow";
import About from "./pages/About";
import Home from "./pages/Home";
import DeckView from "./pages/DeckView"; // ← 追加済みならそのままでOK

function AppContent() {
  const location = useLocation();

  // 🔍 `/search` ページではSidebarを非表示
  const hideSidebar = location.pathname === "/search";

  return (
    <div className="flex min-h-screen bg-gray-100">
      {!hideSidebar && <Sidebar />}

      <div className={`flex-1 p-6 ${hideSidebar ? "w-full" : ""}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/search" element={<SearchWindow />} />
          <Route path="/deck-view" element={<DeckView />} /> {/* DeckViewは残す */}
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
