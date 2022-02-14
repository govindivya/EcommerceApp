import React, { Fragment } from "react";
import "./NotFound.css";
import {Link} from 'react-router-dom'
const NotFound = () => {
    console.log("Not found")
  return (
    <Fragment>
      <div className="notFoundContainer">
          <svg viewBox="0 0 1000 400">
            <text id="mytext" x="50%" y="50%" textAnchor="middle" fill="none">PAGE NOT FOUND !</text>
            <use xlinkHref="#mytext" className="copy copy1" />
            <use xlinkHref="#mytext" className="copy copy2" />
            <use xlinkHref="#mytext" className="copy copy3" />
            <use xlinkHref="#mytext" className="copy copy4" />
            <use xlinkHref="#mytext" className="copy copy5" />
          </svg>
          <div className="goHome">
            <Link to="/products">Find Products</Link>
          </div>
      </div>
    </Fragment>
  );
};

export default NotFound;
