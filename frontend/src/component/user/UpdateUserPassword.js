import React, { Fragment, useEffect, useState } from "react";
import "./UpdateUserPassword.css";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import FaceIcon from "@mui/icons-material/Face";
import { useAlert } from "react-alert";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { updatePassword, logout, clearErrors } from "../../actions/userAction";
import MetaData from "../layout/MetaData";

const UpdateUserPassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const alert = useAlert();
  const { isUpdated, error, loading } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate=useNavigate()
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors())
      if(error==='MONGOERROR'){
        navigate("/")
      }
    }
    if (isUpdated) {
      alert.success("Password changed successfully ")
     dispatch(logout());
    }
  }, [error, isUpdated, alert]);
  const updatePasswordSubmit = (e) => {
    e.preventDefault()
    dispatch(updatePassword(oldPassword, newPassword,confirmPassword));
  };
  return loading ? (
    <Loader />
  ) : (
    <Fragment>
      <MetaData title={"Update Password"}/>
      <div className="UpdatePasswordContainer">
        <div className="UpdatePasswordBox">
          <form className="UpdatePasswordForm" onSubmit={updatePasswordSubmit}>
            <div className="updatePassword">
              <LockOpenIcon />
              <input
                type="password"
                placeholder="Old Password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
            <div className="updatePassword">
              <LockOpenIcon />
              <input
                type="password"
                placeholder="New Password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="updatePassword">
              <LockOpenIcon />
              <input
                type="password"
                placeholder="Confrim New Password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Link to="/password/forgot">Forget Password ?</Link>
            <input
              type="submit"
              value="Update Password"
              className="UpdatePasswordBtn"
            />
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateUserPassword;
