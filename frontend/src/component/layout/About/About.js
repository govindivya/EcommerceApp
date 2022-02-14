import React from "react";
import "./aboutSection.css";
import { Button, Typography, Avatar } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

const About = () => {
  const visitInstagram = () => {
    window.location = "https://www.instagram.com/govindkushwaha827/";
  };
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://res.cloudinary.com/nitp/image/upload/v1643906057/avatars/cz6ktnyzn2cknpciekez.jpg"
              alt="Founder"
            />
            <Typography>Govind Kumar Kushwaha</Typography>
            <Button onClick={visitInstagram} color="primary">
              Visit Instagram
            </Button>
            <span>
              This is a sample wesbite made by @Govind for learning purpose.
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <h2>I am an NITian</h2>
            <p>I am a 3rd year (Undegraduate) student at NIT Patna</p>
            <p>
              I am very intreseted in software devlopement and and always keen
              to learn new technologies
            </p>
            <p>
              I have good knowledge of javascript , mongodb,react,express,nodejs
              and litle bit knowledge of MySQL, PostgreSQL,python,c++ and
              intermediate knowledge of JAVA.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
