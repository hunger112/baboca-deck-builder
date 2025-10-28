import React from "react";

function FilterBar({ filters, setFilters, applyFilters }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="mb-4 p-3 bg-gray-100 rounded-lg">
      <div className="grid grid-cols-2 gap-3">
        {/* カードタイプ */}
        <div>
          <label className="block text-sm font-semibold mb-1">カードタイプ</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="border p-1 rounded w-full"
          >
            <option value="">すべて</option>
            <option value="キャラ">キャラ</option>
            <option value="アクション">アクション</option>
          </select>
        </div>

        {/* 所属 */}
        <div>
          <label className="block text-sm font-semibold mb-1">所属</label>
          <select
            name="affiliation"
            value={filters.affiliation}
            onChange={handleChange}
            className="border p-1 rounded w-full"
          >
            <option value="">すべて</option>
            <option value="烏野">烏野</option>
            <option value="青葉城西">青葉城西</option>
            <option value="音駒">音駒</option>
            <option value="梟谷">梟谷</option>
            <option value="稲荷崎">稲荷崎</option>
            <option value="井闥山">井闥山</option>
            <option value="鴎台">鴎台</option>
          </select>
        </div>

        {/* 能力値 */}
        <div className="col-span-2">
          <label className="block text-sm font-semibold mb-1">能力値</label>
          <div className="flex items-center gap-2">
            <select
              name="statType"
              value={filters.statType}
              onChange={handleChange}
              className="border p-1 rounded"
            >
              <option value="">指定なし</option>
              <option value="serve">サーブ</option>
              <option value="block">ブロック</option>
              <option value="receive">レシーブ</option>
              <option value="toss">トス</option>
              <option value="attack">アタック</option>
            </select>
            <input
              type="number"
              name="minStat"
              value={filters.minStat}
              onChange={handleChange}
              placeholder="最小"
              className="border p-1 rounded w-20"
            />
            ～
            <input
              type="number"
              name="maxStat"
              value={filters.maxStat}
              onChange={handleChange}
              placeholder="最大"
              className="border p-1 rounded w-20"
            />
          </div>
        </div>
      </div>

      <div className="text-right mt-3">
        <button
          onClick={applyFilters}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          絞り込みを適用
        </button>
      </div>
    </div>
  );
}

export default FilterBar;
