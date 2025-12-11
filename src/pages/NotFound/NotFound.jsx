import React from "react";
import { Link } from "react-router";
import error from "../../assets/images/error.gif"

const NotFound = () => {
  return (
    <div className="flex h-screen items-center justify-center text-center font-mono text-5xl">
      <div>
        <img src={error} alt="404"/>
        <h1 className="text-9xl text-info">404</h1>
        <h2>Not Found</h2>
        <Link to="/" className="btn-accent btn">
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
