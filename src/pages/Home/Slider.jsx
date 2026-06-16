import React from "react";

const Slider = () => {
  return (
    <div>
      <div
        className="hero min-h-screen"
        style={{ backgroundImage: "url(https://placeimg.com/500/200/arch)" }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content">
          <a href="https://ibb.co.com/VYL0Gz5t"><img src="https://i.ibb.co.com/k2GVTwvx/6.webp" alt="6" border="0" /></a>
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">Hello there</h1>
            <p className="mb-5">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
            <button className="btn btn-primary">Get Started</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slider;
