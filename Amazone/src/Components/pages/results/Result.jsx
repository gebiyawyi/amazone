import React, { useEffect, useState } from "react";
import LayOut from "../../Layout/LayOut";
import { useParams } from "react-router-dom";
import axios from "axios";
import { producturl } from "../../../api/endpoint";
import ProductCard from "../../products/ProductCard";
import Loader from "../../Loader/Loader";
import styles from "./Result.module.css";

function Result() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { categoryName } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${producturl}/products/category/${categoryName}`)
      .then((res) => {
        setResults(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load products");
        setLoading(false);
      });
  }, [categoryName]);

  if (loading) {
    return (
      <LayOut>
        <Loader message={`Loading ${categoryName} products...`} />
      </LayOut>
    );
  }

  if (error) {
    return (
      <LayOut>
        <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
          <h2>{error}</h2>
        </div>
      </LayOut>
    );
  }

  return (
    <LayOut>
      <section
        style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}
      >
        <h1 style={{ padding: "30px 0 10px 0", fontSize: "28px" }}>Results</h1>
        <p
          style={{
            padding: "10px 0 20px 0",
            fontSize: "16px",
            color: "#565959",
          }}
        >
          Category /{" "}
          <span style={{ color: "#c45500", fontWeight: "bold" }}>
            {categoryName}
          </span>
        </p>
        <hr style={{ border: "1px solid #e7e7e7", margin: "10px 0 30px 0" }} />

        {results.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <h2>No products found</h2>
            <p>Try searching for something else</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "25px",
              padding: "10px 0",
            }}
          >
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </LayOut>
  );
}

export default Result;
