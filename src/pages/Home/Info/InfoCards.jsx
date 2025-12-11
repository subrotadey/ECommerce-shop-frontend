import React from "react";

const InfoCards = ({ img, cardTitle, cardDetails, bgClass }) => {
  return (
    <div>
      <div className={`card lg:card-side shadow-lg shadow-cyan-500/50 ${bgClass}`}>
        <figure className="pt-5">
          <img className="w-1/5 lg:w-2/5" src={img} alt="Album" />
        </figure>
        <div className="card-body  text-white">
          <h2 className="card-title font-bold">{cardTitle}!</h2>
          <p>{cardDetails}</p>
        </div>
      </div>
    </div>
  );
};

export default InfoCards;
