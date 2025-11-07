// src/pages/Home.js
import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableCard({ card, index, onRemove, onIncrease, onDecrease, moveLeft, moveRight, cleanCardName }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: card.number });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-3 rounded-lg shadow-md flex flex-col items-center w-[200px] h-[430px]"
    >
      <div className="w-full h-[260px] overflow-hidden rounded-md bg-gray-100">
        <img
          src={card.image}
          alt={card.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='600'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='20'%3Eno image%3C/text%3E%3C/svg%3E";
          }}
        />
      </div>

      <p className="text-center mt-2 text-sm font-medium w-full break-words whitespace-normal leading-tight line-clamp-2 h-[3em]">
        {cleanCardName(card.name)}
      </p>

      <div className="flex items-center mt-2 w-full justify-center gap-1">
        <button onClick={() => moveLeft(index)} className="bg-gray-200 px-2 py-1 rounded">
          ＜
        </button>

        <button onClick={() => onDecrease(index)} className="bg-gray-300 px-3 py-1 rounded-l">
          −
        </button>
        <span className="px-4 bg-gray-100">{card.count}</span>
        <button onClick={() => onIncrease(index)} className="bg-gray-300 px-3 py-1 rounded-r">
          ＋
        </button>

        <button onClick={() => moveRight(index)} className="bg-gray-200 px-2 py-1 rounded">
          ＞
        </button>
      </div>

      <button
        onClick={() => onRemove(index)}
        className="mt-3 bg-red-500 text-white px-4 py-1 rounded w-full"
      >
        削除
      </button>
    </div>
  );
}

function Home() {
  const [keyword, setKeyword] = useState("");
  const [deck, setDeck] = useState([]);

  useEffect(() => {
    const savedDeck = localStorage.getItem("deck");
    if (savedDeck) setDeck(JSON.parse(savedDeck));

    const channel = new BroadcastChannel("deck_channel");
    channel.onmessage = (event) => {
      if (event.data.type === "ADD_CARD_TO_DECK") {
        const card = event.data.card;
        setDeck((prev) => {
          const existing = prev.find((c) => c.number === card.number);
          if (existing) {
            return prev.map((c) =>
              c.number === card.number ? { ...c, count: c.count + 1 } : c
            );
          }
          return [...prev, { ...card, count: 1 }];
        });
      }
    };
    return () => channel.close();
  }, []);

  useEffect(() => {
    localStorage.setItem("deck", JSON.stringify(deck));
  }, [deck]);

  const handleSearch = () => {
    const encoded = encodeURIComponent(keyword);
    const base = window.location.origin + window.location.pathname;
    const url = `${base}#/search?keyword=${encoded}`;
    window.open(url, "searchWindow", "noopener,noreferrer,width=600,height=700,left=300,top=100");
  };

  const handleOpenDeckView = () => {
    const totalCards = deck.reduce((sum, card) => sum + card.count, 0);
    if (totalCards > 40) {
      alert("デッキが40枚以上あります。40枚以下にしてください。");
      return;
    }
    localStorage.setItem("deckData", JSON.stringify(deck));

    const base = window.location.origin + window.location.pathname;
    const url = `${base}#/deck-view`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleIncrease = (i) => {
    const newDeck = [...deck];
    newDeck[i].count += 1;
    setDeck(newDeck);
  };
  const handleDecrease = (i) => {
    const newDeck = [...deck];
    if (newDeck[i].count > 1) newDeck[i].count -= 1;
    setDeck(newDeck);
  };
  const handleRemove = (i) => {
    setDeck(deck.filter((_, idx) => idx !== i));
  };
  const moveLeft = (i) => {
    if (i === 0) return;
    const newDeck = [...deck];
    [newDeck[i - 1], newDeck[i]] = [newDeck[i], newDeck[i - 1]];
    setDeck(newDeck);
  };
  const moveRight = (i) => {
    if (i === deck.length - 1) return;
    const newDeck = [...deck];
    [newDeck[i + 1], newDeck[i]] = [newDeck[i], newDeck[i + 1]];
    setDeck(newDeck);
  };

  const cleanCardName = (name) => name.replace(/_\d+$/, "");
  const totalCards = deck.reduce((sum, c) => sum + c.count, 0);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = deck.findIndex((c) => c.number === active.id);
      const newIndex = deck.findIndex((c) => c.number === over.id);
      setDeck((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-3">カード検索</h1>
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="キーワードを入力"
          className="border rounded p-2 mr-2"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">
          検索
        </button>
      </div>

      <h2 className="text-xl font-bold mt-6 mb-2">現在のデッキ ({totalCards}枚)</h2>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={deck.map((c) => c.number)} strategy={rectSortingStrategy}>
          <div className="flex flex-wrap gap-4">
            {deck.map((card, i) => (
              <SortableCard
                key={card.number}
                card={card}
                index={i}
                onRemove={handleRemove}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                moveLeft={moveLeft}
                moveRight={moveRight}
                cleanCardName={cleanCardName}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {deck.length > 0 && totalCards <= 40 && (
        <button
          onClick={handleOpenDeckView}
          className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          デッキ画像出力
        </button>
      )}
    </div>
  );
}

export default Home;
