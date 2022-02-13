import React, { Fragment, useState, useEffect } from "react";
import MetaData from "../layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import {
  newProduct,
  clearErrors,
  updateProduct,
} from "../../actions/productAction";
import {
  AccountTree,
  Description,
  Storage,
  Spellcheck,
  AttachMoney,
} from "@mui/icons-material";
import { useAlert } from "react-alert";
import Sidebar from "./Sidebar";
import "./NewProduct.css";
import { Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../layout/Loader/Loader";
import { getProductDetails } from "../../actions/productAction";

const EditProduct = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { id } = useParams();
  const { loading, error, success } = useSelector((state) => state.newProduct);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [Stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  
  const { product, error: error1 } = useSelector(
    (state) => state.productDetails
  );

  const categories = [
    "Laptop",
    "Mobile",
    "Electronics",
    "Clothes",
    "Men's Wear",
    "Women's Wear",
    "Kids Wear",
    "Digital",
    "Stationary",
    "Electrical",
    "Fashion",
    "Summer Clothes",
    "Winter Clothes",
    "Furniture",
    "Sports",
    "Medicine",
    "Health",
    "Games",
    "Machines",
    "Handlooms",
    "Handcrafted",
  ];
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
      if(error==='MONGOERROR'){
        navigate("/")
      }
    }
    if (success) {
      alert.success("Product Updated Successfully");
      navigate("/admin/dashboard");
    }
  }, [dispatch, alert, error, navigate, success]);


  useEffect(() => {
    if(error1){
      if (error1 === "MONGOERROR") {
        alert.show("This is not a valid resource address");
        navigate("/");
      } else {
        alert.error(error1);
        dispatch(clearErrors())
      }
    }
    dispatch(getProductDetails(id));

  }, [dispatch, alert, error1, navigate, id]);
  const createProductEditHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    if (name && name.trim() != "") myForm.set("name", name);
    if (price && price.trim() != "") myForm.set("price", price);
    if (description && description.trim() != "")
      myForm.set("description", description);
    if (category && category.trim() != "") myForm.set("category", category);
    if (Stock && Stock.trim() != "") myForm.set("stock", Stock);
    images.forEach((image) => {
      myForm.append("images", image);
    });
    console.log(myForm);
    dispatch(updateProduct(id, myForm));
  };

  const createProductImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  return (
    <Fragment>
      <MetaData title="Edit Product" />
      {loading === true ? (
        <Loader />
      ) : (
        product &&<div className="newProductPage">
        <Sidebar />
        <div
          className="newProductContainer"
          style={{
            backgroundImage: `url(${
              product && product.images ? product.images[0].url : ""
            })`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <form
            className="createProductForm"
            encType="multipart/form-data"
            onSubmit={createProductEditHandler}
          >
            <h1>Edit {product && product.name}</h1>

            <div>
              <Spellcheck />
              <input
                type="text"
                placeholder="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <AttachMoney />
              <input
                type="number"
                placeholder="Price"
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div>
              <Description />

              <textarea
                placeholder="Product Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                cols="30"
                rows="1"
              ></textarea>
            </div>

            <div>
              <AccountTree />
              <select onChange={(e) => setCategory(e.target.value)}>
                <option value="">Choose Category</option>
                {categories.map((cate) => (
                  <option key={cate} value={cate}>
                    {cate}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Storage />
              <input
                type="number"
                placeholder="Stock"
                onChange={(e) => setStock(e.target.value)}
              />
            </div>

            <div id="createProductFormFile">
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={createProductImagesChange}
                multiple
              />
            </div>

            <div id="createProductFormImage">
              {imagesPreview.map((image, index) => (
                <img key={index} src={image} alt="Product Preview" />
              ))}
            </div>

            <Button
              id="createProductBtn"
              type="submit"
              disabled={loading ? true : false}
            >
              Create
            </Button>
          </form>
        </div>
      </div>
      )}
    </Fragment>
  );
};

export default EditProduct;
