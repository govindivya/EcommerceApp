import React, { Fragment, useRef, useState, useEffect } from "react";
import Loader from "../layout/Loader/Loader";
import { Link } from "react-router-dom";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import FaceIcon from "@mui/icons-material/Face";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, updateProfile } from "../../actions/userAction";
import { useAlert } from "react-alert";
import { useLocation, useNavigate } from "react-router-dom";
import "./UpdateUserProfile.css";
import MetaData from "../layout/MetaData";
const UpdateUserProfile = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);

  const [avatar, setAvatar] = useState();
  const [avatarPreview, setAvatarPreview] = useState(
    "/Profile.png" || user.avatar.url
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const { error, loading, isUpdated } = useSelector((state) => state.profile);

  const registerSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("avatar", avatar);
    dispatch(updateProfile(myForm));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
      if(error==='MONGOERROR'){
        navigate("/")
      }
    }
    if (isUpdated === true) {
      alert.success("Profile updated successfully ");
      navigate("/account");
    }
  }, [error, isUpdated, alert, navigate, dispatch]);

  const avatarChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Update Profile"}/>
          <div className="updateContainer">
            <div className="update">
              <form
                className="updateForm"
                encType="multipart/form-data"
                onSubmit={registerSubmit}
              >
                <div>
                  <FaceIcon />
                  <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div id="updateImage">
                  <img src={avatarPreview} alt="Avatar Preview" />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={avatarChange}
                  />
                </div>
                <input type="submit" value="Update" className="updateBtn" />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default UpdateUserProfile;
