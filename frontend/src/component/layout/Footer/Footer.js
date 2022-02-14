import React from "react";
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png";
import "./Footer.css";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftFooter">
        <h3>DOWNLOAD OUR APP</h3>
        <img src={playStore} alt="playstore" />
        <img src={appStore} alt="Appstore" />
      </div>

      <div className="midFooter">
        <h1>GShop</h1>
        <p>High Quality is our first priority</p>

        <p>Copyrights 2021 &copy; Govind</p>
      </div>

      <div className="rightFooter">
        <h4>Follow Us</h4>
        <a href="https://www.instagram.com/govindkushwaha827/" target="_blank">Instagram</a>
        <a href="https://www.facebook.com/people/Govind-Kumar-Kushwaha/100017806238756/" target="_blank">Facebook</a>
        <a href="https://www.youtube.com" target="_blank">You Tube</a>
        </div>
    </footer>
  );
};

export default Footer;
