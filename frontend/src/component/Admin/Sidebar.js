import React from "react";
import logo from "../../images/logo.png";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import {
  PostAdd,
  Add,
  ImportExport,
  ListAlt,
  Dashboard,
  People,
  RateReview,
  ExpandMore,
} from "@mui/icons-material";
import { TreeView, TreeItem } from "@mui/lab";

const Sidebar = () => {
  return (
    <div className="dashboardSidebar">
      <Link to="/">
        <img src={logo} alt="Ecommerce" />
      </Link>
      <Link to="/admin/dashboard">
        <p>
          <Dashboard /> Dashboard
        </p>
      </Link>

     <div className="treeToggler">
     <TreeView
        defaultCollapseIcon={<ExpandMore />}
        defaultExpandIcon={<ImportExport />}
      >
        <TreeItem nodeId="1" label="Products">
          <Link to="/admin/products">
            <TreeItem nodeId="2" label="All" icon={<PostAdd />} />
          </Link>

          <Link to="/admin/product/new">
            <TreeItem nodeId="3" label="Create" icon={<Add />} />
          </Link>
        </TreeItem>
      </TreeView>
     </div>
      <Link to="/admin/orders">
        <p>
          <ListAlt />
          Orders
        </p>
      </Link>

      {/*  */}
      <div className="treeToggler">
     <TreeView
        defaultCollapseIcon={<ExpandMore />}
        defaultExpandIcon={<ImportExport />}
      >
        <TreeItem nodeId="1" label="Users">
          <Link to="/admin/users">
            <TreeItem nodeId="2" label="All User" icon={<PostAdd />} />
          </Link>

          <Link to="/admin/create/user">
            <TreeItem nodeId="3" label="Create User" icon={<Add />} />
          </Link>
        </TreeItem>
      </TreeView>
     </div>
      {/* <Link to="/admin/users">
        <p>
          <People /> Users
        </p>
      </Link> */}
      <Link to="/admin/reviews">
        <p>
          <RateReview />
          Reviews
        </p>
      </Link>
    </div>
  );
};

export default Sidebar;
