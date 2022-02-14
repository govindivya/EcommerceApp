import React, { Fragment, useState, useEffect, useRef } from "react";
import MetaData from "../layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { newProduct, clearErrors } from "../../actions/productAction";
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
import { NEW_PRODUCT_RESET } from "../../constants/productConstant";
import { useNavigate, useParams } from "react-router-dom";


const NewProduct = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { loading, error, success } = useSelector((state) => state.newProduct);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [Stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const ref=useRef(null);

  const navigate = useNavigate();

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
      alert.success("Product Created Successfully");
      setName("");
      setPrice(0);
      setDescription("");
      setCategory("");
      setStock(0);
      setImages([]);
      setImagesPreview([]);
      dispatch({ type: NEW_PRODUCT_RESET });
      ref.current.disabled=false;
    }
  }, [dispatch, alert, error, navigate, success]);

  const createProductSubmitHandler = (e) => {
    e.preventDefault();
    console.log(ref)
    ref.current.disabled=true;
    const myForm={
      name,
      price,description,
      category,
      stock:Stock,
      images
    }
    dispatch(newProduct(myForm));
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
      <MetaData title="Create Product" />
      <div className="newProductPage">
        <Sidebar />
        <div className="newProductContainer">
          <form
            className="createProductForm"
            encType="multipart/form-data"
            onSubmit={createProductSubmitHandler}
          >
            <h1>Create Product</h1>

            <div>
              <Spellcheck />
              <input
                type="text"
                placeholder="Product Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <AttachMoney />
              <input
                type="number"
                placeholder="Price"
                required
                value={price}
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
              <input type="text" placeholder="Category" value={category} onChange={(e)=>setCategory(e.target.value)}/>
            </div>

            <div>
              <Storage />
              <input
                type="number"
                placeholder="Stock"
                required
                value={Stock}
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
              ref={ref}
              
            >
              {
                 ref.current && ref.current.disabled===true?"Creating...":"Create"               
              }
            </Button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default NewProduct;
