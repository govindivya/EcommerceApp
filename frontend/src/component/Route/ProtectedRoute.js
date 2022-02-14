import React, { Fragment, useEffect } from "react";
import { useSelector } from "react-redux";
import {useNavigate} from "react-router-dom";
import Loader from "../layout/Loader/Loader";

const ProtectedRoute = ({ children ,admin}) => {
  const navigate = useNavigate();
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);
  useEffect(() => {
    if (loading != undefined && isAuthenticated != undefined) {
     
      if ((!loading && !isAuthenticated) || (admin===true && user && user.role.toString() !='admin' )) {
        navigate("/login");
      }
    }
  }, [isAuthenticated, loading, navigate, user]);
  return loading && loading===false ? (
    <Loader />
  ) : (
    (isAuthenticated != undefined && isAuthenticated && children)
  );
};

export default ProtectedRoute;
