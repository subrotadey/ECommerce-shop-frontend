import React from "react";

const CharacteristicsCard = ({ img, cardTitle, cardDetails, bgClass }) => {
  return (
    <div
      className={`card shadow-lg shadow-cyan-500/50 transition delay-150 ease-in-out text-black hover:bg-violet-300 hover:text-white lg:card-side ${bgClass}`}
    >
      <figure className="pt-5">
        <img className="w-1/5 lg:w-2/5" src={img} alt="Album" />
      </figure>
      <div className="card-body font-sans">
        <h2 className="card-title font-bold text-white">{cardTitle}!</h2>
        <p>{cardDetails}</p>
      </div>
    </div>
  );
};

export default CharacteristicsCard;
