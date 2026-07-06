import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import Loader from "../Loader/Loader";
import styles from "./Product.module.css";

function Product() {
  const [products, setproducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://fakestoreapi.com/products")
      .then((response) => {
        setproducts(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to load products");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loader message="Loading products..." />;
  }

  if (error) {
    return <div className={styles.errorContainer}>{error}</div>;
  }

  return (
    <section className={styles.productSection}>
      {products.map((singleProduct) => (
        <ProductCard product={singleProduct} key={singleProduct.id} />
      ))}
    </section>
  );
}

export default Product;
