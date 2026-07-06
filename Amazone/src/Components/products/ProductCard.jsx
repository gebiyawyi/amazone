import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Rating from "@mui/material/Rating";
import CurrencyFormat from "../CurrencyFormat/CurrencyFormat";
import { addToCart } from "../utility/actions";
import styles from "./ProductCard.module.css";

function ProductCard({ product }) {
  if (!product) return null;
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);

  const { image, title, id, rating, price } = product;

  const truncatedTitle =
    title && title.length > 50 ? `${title.substring(0, 50)}...` : title;

  const handleAddToCart = (e) => {
    e.preventDefault();
    const productToAdd = {
      id,
      title,
      price,
      image,
      rating,
      quantity: 1,
    };
    dispatch(addToCart(productToAdd));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className={styles.productCard}>
      <Link to={`/productdetail/${id}`} className={styles.productLink}>
        <img
          src={image}
          alt={title}
          className={styles.productImage}
          loading="lazy"
        />
      </Link>

      <div className={styles.productInfo}>
        <h3 className={styles.productTitle}>{truncatedTitle}</h3>

        <div className={styles.ratingContainer}>
          {rating && (
            <>
              <span className={styles.ratingStars}>
                <Rating
                  value={rating.rate || 0}
                  precision={0.1}
                  readOnly
                  size="small"
                />
              </span>
              <span className={styles.ratingCount}>{rating.count || 0}</span>
            </>
          )}
        </div>

        <div className={styles.priceContainer}>
          <CurrencyFormat amount={price} />
        </div>

        <div className={styles.deliveryBadge}>
          FREE delivery <strong>Tomorrow</strong>
        </div>

        <div className={styles.primeBadge}>PRIME</div>

        <button
          className={`${styles.addToCartButton} ${added ? styles.added : ""}`}
          onClick={handleAddToCart}
        >
          {added ? "✅ Added!" : "🛒 Add to Cart"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
