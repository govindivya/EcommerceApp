import React, { Fragment, useEffect } from "react";
import MetaData from "../layout/MetaData";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import "./Profile.css";

const Profile = () => {
  const { user, error, loading } = useSelector((state) => state.user);
  const alert = useAlert();
  useEffect(() => {
    if (error) alert.error(error);
  }, [error, alert]);
  return loading ? (
    <Loader />
  ) : (
    <Fragment>
      <MetaData title={user.name} />
      <div className="profileContainer">
        <div>
          {/* <h1>My Profile</h1> */}
          <img
            src={user.avatar && user.avatar.url ? user.avatar.url : ""}
            alt=""
          />
          <Link to="/me/update">Edit Profile</Link>
        </div>
        <div>
          <div>
            <h4>Full Name</h4>
            <p>{user.name}</p>
          </div>
          <div>
            <h4>Email</h4>
            <p>{user.email}</p>
          </div>
          <div>
            <h4>Joined on </h4>
            <p>{String(user.createdAt).substring(0, 10)}</p>
          </div>
          <div>
            <Link to="/orders">My Orders</Link>
            <Link to="/password/update">Change Password</Link>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Profile;
