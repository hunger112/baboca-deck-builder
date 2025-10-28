import React from "react";

const SearchModal = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4">検索</h2>
        <input
          type="text"
          placeholder="キーワードを入力"
          className="border w-full p-2 rounded mb-4"
        />
        <div className="flex justify-end">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
