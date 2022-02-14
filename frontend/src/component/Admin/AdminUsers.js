import React, { Fragment, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import "./AdminUsers.css";
import MetaData from "../layout/MetaData";
import { Button } from "@mui/material";
import { Delete, NavigationSharp } from "@mui/icons-material";
import Loader from "../layout/Loader/Loader";

import { allUsers, clearErrors, deleteUser } from "../../actions/userAction";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import Pagination from "react-js-pagination";

const AdminUser = (props) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const resultPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const { users, error, loading, success, usersCount } = useSelector(
    (state) => state.adminUser
  );

  const handleDelete = async (id) => {
    const deleteIt = window.confirm("Are you sure to delete ", id);
    if (deleteIt) {
      dispatch(deleteUser(id));
    }
  };
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
      if(error==='MONGOERROR'){
        navigate("/")
      }
    }
    if (success) {
      alert.success("User is deleted successfully");
      dispatch(allUsers());
    }
    dispatch(allUsers(currentPage));
  }, [error, dispatch, alert, success,currentPage,navigate]);

  //print products
  useEffect(() => {}, []);
  return (
    <Fragment>
      <MetaData title={"Admin Users"} />
      {loading && loading === true ? (
        <Loader />
      ) : (
        <div className="adminUsers">
          <Sidebar />
          <div className="adminUsersContainer">
            <h1>All Orders</h1>
            <div className="adminUsersHeader">
              <p>Name</p>
              <p>Email</p>
              <p>Action</p>
            </div>
            {users &&
              Array.from(users).map((item, index) => (
                <div key={index} className="adminUsersBox">
                  <p>{item.name}</p>
                  <p>{item.email}</p>
                  <p>
                    <Delete
                      className="adminUserIcon"
                      onClick={() => handleDelete(item._id)}
                    />
                  </p>
                </div>
              ))}
            {users && Array.from(users).length === 0 && (
              <div className="noAdminUsers">
                <h1>No User Found</h1>
                <Button
                  style={{
                    backgroundColor: "tomato",
                    margin: "5vmax auto",
                    padding: "2vmax 3vmax",
                    color: "white",
                  }}
                  onClick={() => navigate("/admin/dashboard")}
                >
                  Go To Dashboard
                </Button>
              </div>
            )}
             {resultPerPage < usersCount && (
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultPerPage}
                totalItemsCount={usersCount}
                onChange={(e) => setCurrentPage(e)}
                nextPageText={
                  (usersCount - (usersCount % resultPerPage)) /
                    resultPerPage ===
                  currentPage
                    ? "No More"
                    : "Next"
                }
                prevPageText="Prev"
                firstPageText="1st"
                lastPageText="last"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
          )}
          </div>
         
        </div>
      )}
    </Fragment>
  );
};

export default AdminUser;
