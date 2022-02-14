import React, { Fragment, useState, useEffect, useRef } from "react";
import Loader from "../layout/Loader/Loader";
import { Link } from "react-router-dom";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import FaceIcon from "@mui/icons-material/Face";
import { useDispatch, useSelector } from "react-redux";
import { adminAddUser, clearErrors } from "../../actions/userAction";
import { useAlert } from "react-alert";
import { useLocation, useNavigate } from "react-router-dom";
import MetaData from "../layout/MetaData";
import { Button } from "@mui/material";
import Sidebar from "./Sidebar";
import './AdminAddUser.css'

const AdminAddUser = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const ref = useRef();
  const { error, loading, success } = useSelector((state) => state.user);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState("");
  const [avatar, setAvatar] = useState([]);
  const [avatarPreview, setAvatarPreview] = useState([]);


  useEffect(() => {
    if (error) {

      alert.error(error);
      ref.current.disabled=false;
      dispatch(clearErrors());
      if(error==='MONGOERROR'){
        navigate("/")
      }
    }
    if (success) {
      alert.success("User Added Successfully.");
      setName("");
      setEmail("");
      setPassword("");
      setPasswordMatch("");
      setAvatar(null);
      ref.current.disabled=false;
    }
  }, [dispatch, alert, error, success]);


  const setImage = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar((old) => [...old, reader.result]);
        setAvatar((old) => [...old, reader.result]);

      }
      reader.readAsDataURL(e.target.files[0]);
    };
  };

  const addUserHandler = (e) => {
    e.preventDefault();
    if(password.toString()!==passwordMatch.toString()){
      alert.show("Both password should be same");
      return;
    }
    ref.current.disabled=true;
    const myForm={
      name,
      password,
      email,
      avatar:avatar[0]
    }
    dispatch(adminAddUser(myForm));
  };
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Add User"} />
          <div className="adminAddUser">
            <Sidebar />
            <div className="adminAddUserContainer">
              <form
                className="adminAddUserForm"
                encType="multipart/form-data"
                onSubmit={addUserHandler}
              >
                <h1>Add User</h1>

                <div>
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <FaceIcon />
                  <input
                    type="text"
                    placeholder="User Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="Password Again"
                    required
                    onChange={(e) => setPasswordMatch(e.target.value)}
                  />
                </div>
                <div id="adminAddUserFormFile">
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={setImage}
                  />
                </div>
                <div id="adminAddUserFormImage">
                {avatar.map((image, index) => (
                <img key={index} src={image} alt="Product Preview" />
              ))}
                </div>
                <Button id="adminAddUserBtn" type="submit" ref={ref}>
                  {ref.current && ref.current.disabled === true
                    ? "Adding..."
                    : "Add"}
                </Button>
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default AdminAddUser;
