import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import LayOut from "../../Layout/LayOut";
import { useParams } from "react-router-dom";
import axios from "axios";
import { producturl } from "../../../api/endpoint";
import Loader from "../../Loader/Loader";
import CurrencyFormat from "../../CurrencyFormat/CurrencyFormat";
import Rating from "@mui/material/Rating";
import styles from "./Productdetail.module.css";
import { addToCart } from "../../utility/actions";  
function Productdetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${producturl}/products/${productId}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      const productToAdd = {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        rating: product.rating,
        quantity: quantity,
      };
      dispatch(addToCart(productToAdd));
    }
  };

  if (loading) {
    return (
      <LayOut>
        <Loader message="Loading product details..." />
      </LayOut>
    );
  }

  if (!product) {
    return (
      <LayOut>
        <div
          style={{
            textAlign: "center",
            padding: "50px",
            fontSize: "18px",
            color: "#565959",
          }}
        >
          Product not found
        </div>
      </LayOut>
    );
  }

  const { image, title, description, price, rating, category } = product;

  return (
    <LayOut>
      <div className={styles.detailContainer}>
        <div className={styles.breadcrumb}>
          <Link to="/">Home</Link> /
          <Link to={`/category/${category}`}> {category}</Link> /
          <span>{title.substring(0, 30)}...</span>
        </div>

        <div className={styles.productLayout}>
          <div className={styles.imageContainer}>
            <img src={image} alt={title} className={styles.mainImage} />
          </div>

          <div className={styles.infoContainer}>
            <h1 className={styles.productTitle}>{title}</h1>

            <div className={styles.ratingSection}>
              <Rating value={rating?.rate || 0} precision={0.1} readOnly />
              <span className={styles.ratingCount}>
                ({rating?.count || 0} reviews)
              </span>
            </div>

            <div className={styles.priceSection}>
              <CurrencyFormat amount={price} />
              <span className={styles.taxInfo}>Inclusive of all taxes</span>
            </div>

            <div className={styles.descriptionSection}>
              <h3>About this item</h3>
              <p className={styles.fullDescription}>{description}</p>
            </div>

            <div className={styles.deliveryInfo}>
              <p>
                FREE delivery <strong>Tomorrow</strong>
              </p>
              <p className={styles.stockStatus}>✅ In Stock</p>
            </div>

            <div className={styles.quantitySection}>
              <label>Quantity:</label>
              <select
                className={styles.quantitySelect}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.buttonGroup}>
              <button className={styles.addToCartBtn} onClick={handleAddToCart}>
                🛒 Add to Cart
              </button>
              <button className={styles.buyNowBtn}>Buy Now</button>
            </div>

            <div className={styles.extraInfo}>
              <p>
                <strong>Category:</strong> {category}
              </p>
              <p>
                <strong>ASIN:</strong> B0
                {Math.floor(Math.random() * 1000000000)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </LayOut>
  );
}

export default Productdetail;
