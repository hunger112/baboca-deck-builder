import React from "react";
import { useParams } from "react-router-dom";
import { cardData } from "../data/cardData";

const CardDetail = () => {
  const { id } = useParams();
  const card = cardData.find((c) => c.id === parseInt(id));

  if (!card) return <div className="p-6 text-red-500">カードが見つかりません。</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{card.name}</h1>
      <img
        src={card.image}
        alt={card.name}
        className="w-64 rounded-lg shadow-md mb-4"
      />
      <p className="text-gray-700">{card.description}</p>
    </div>
  );
};

export default CardDetail;
