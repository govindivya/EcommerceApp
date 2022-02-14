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
            <Typography component="h2">Our Brands</Typography>
            <a
              href="https://www.facebook.com/profile.php?id=100017806238756"
              target="blank"
            >
              <FacebookIcon className="youtubeSvgIcon" />
            </a>

            <a href="https://www.instagram.com/govindkushwaha827/" target="blank">
              <InstagramIcon className="instagramSvgIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
