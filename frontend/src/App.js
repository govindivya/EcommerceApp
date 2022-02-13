import "./App.css";
import Header from "./component/layout/Header/Header";
import Footer from "./component/layout/Footer/Footer";
import MetaData from "./component/layout/MetaData";
import React, { useEffect, useState } from "react";
import WebFonts from "webfontloader";
import Loader from "./component/layout/Loader/Loader";
import { useSelector} from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import store from "./store";
import  {loadUser}  from "./actions/userAction";
import  { loadStripe } from "@stripe/stripe-js";
import  { Elements } from "@stripe/react-stripe-js";
import UserOptions from "./component/layout/Header/UserOptions.js";


const Products = React.lazy(() => import("./component/product/Products"));
const ProductDetails = React.lazy(() =>
  import("./component/product/ProductDetails")
);
const LoginSignUp = React.lazy(() => import("./component/user/LoginSignUp"));

const Profile = React.lazy(() => import("./component/user/Profile.js"));

const NotFound = React.lazy(() =>
  import("./component/layout/notfound/NotFound")
);

const ProtectedRoute = React.lazy(() =>
  import("./component/Route/ProtectedRoute")
);
const UpdateUserprofile = React.lazy(() =>
  import("./component/user/UpdateUserProfile.js")
);
const UpdateUserPassword = React.lazy(() =>
  import("./component/user/UpdateUserPassword")
);
const ForgotUserPassword = React.lazy(() =>
  import("./component/user/ForgotUserPassword")
);
const ResetUserPassword = React.lazy(() =>
  import("./component/user/ResetUserPassword")
);
const Cart = React.lazy(() => import("./component/Cart/Cart.js"));
const ConfirmOrder = React.lazy(() => import("./component/Cart/ConfirmOrder"));
const Payment = React.lazy(() => import("./component/Cart/Payment"));


const Shipping = React.lazy(() => import("./component/Cart/Shipping"));
const OrderSuccess = React.lazy(() => import("./component/Cart/OrderSuccess"));
const MyOrders = React.lazy(() => import("./component/Order/MyOrders"));

const OrderDetails = React.lazy(() => import("./component/Order/OrderDetails"));

const Dashboard = React.lazy(() => import("./component/Admin/Dashboard"));
const ProductList = React.lazy(() => import("./component/Admin/ProductList"));
const NewProduct = React.lazy(() => import("./component/Admin/NewProduct"));
const EditProduct = React.lazy(() => import("./component/Admin/EditProduct"));
const AdminOrders = React.lazy(() => import("./component/Admin/Orders"));
const AdminUser = React.lazy(() => import("./component/Admin/AdminUsers"));

const AdminReviewsDetails = React.lazy(() =>
  import("./component/Admin/AdminReviewsDetails")
);
const AdminAddUser= React.lazy(()=>import("./component/Admin/AdminAddUser"))
const AdminReviews = React.lazy(() => import("./component/Admin/AdminReviews"));
const ProcessOrder = React.lazy(() => import("./component/Admin/ProcessOrder"));
const Home = React.lazy(() => import("./component/Home/Home"));
const Contact = React.lazy(()=>import("./component/ContactAbout/Contact"))

const App = () => {
  const { isAuthenticated, user, error } = useSelector((state) => state.user);
  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");
    setStripeApiKey(data.stripeApiKey);
  }

  const handleContextMenu=(e)=>{
    e.preventDefault();
  }
  useEffect(() => {
    WebFonts.load({
      google: {
        families: [
          "Roboto",
          "Droid Sams",
          "Chilanka",
          "Lobster Two",
          "Mochiy Pop P One",
        ],
      },
    });
    store.dispatch(loadUser());
    getStripeApiKey();
    window.addEventListener('contextmenu',handleContextMenu);
    return ()=>{
      window.removeEventListener('contextmenu',handleContextMenu);
    }
  }, []);
  return (
    <Router>
      <MetaData title="HOME" />
      <Header />
      {isAuthenticated && user && <UserOptions user={user} />}
      <React.Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/product/:id" exact element={<ProductDetails />} />
          <Route path="/products" exact element={<Products />} />
          <Route path="/login" exact element={<LoginSignUp />} />
          <Route path="/contact" exact element={<Contact />} />

          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/me/update"
            exact
            element={
              <ProtectedRoute>
                <UpdateUserprofile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/password/update"
            element={
              <ProtectedRoute>
                <UpdateUserPassword />
              </ProtectedRoute>
            }
          />
          <Route path="/shipping" exact element={<Shipping />} />
          <Route
            path="/order/confirm"
            element={
              <ProtectedRoute>
                <ConfirmOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/password/forgot"
            exact
            element={<ForgotUserPassword />}
          />
          <Route
            path="/password/reset/:token"
            exact
            element={<ResetUserPassword />}
          />
          <Route
            path="/payment/process"
            exact
            element={
              <ProtectedRoute>
                {stripeApiKey ? (
                  <Elements stripe={loadStripe(stripeApiKey)}>
                    <Payment />
                  </Elements>
                ) : (
                  <Loader />
                )}
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/success"
            element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order/:id"
            element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute admin={true}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute admin={true}>
                <ProductList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/product/new"
            element={
              <ProtectedRoute admin={true}>
                <NewProduct />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/product/edit/:id"
            element={
              <ProtectedRoute admin={true}>
                <EditProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute admin={true}>
                <AdminOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/order/:id"
            element={
              <ProtectedRoute admin={true}>
                <ProcessOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute admin={true}>
                <AdminUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reviews/:id"
            element={
              <ProtectedRoute admin={true}>
                <AdminReviewsDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reviews"
            element={
              <ProtectedRoute admin={true}>
                <AdminReviews />
              </ProtectedRoute>
            }
          />
           <Route
            path="/admin/create/user"
            element={
              <ProtectedRoute admin={true}>
                <AdminAddUser />
              </ProtectedRoute>
            }
          />
          <Route path="/cart" exact element={<Cart />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </React.Suspense>
      <Footer />
    </Router>
  );
};

export default App;
