import React from "react";
import classes from "./Catagory.module.css";
import { Link } from "react-router-dom";

function CatagoryCard({ data }) {
  console.log(data);

  return (
    <div className={classes.catagory}>
      <Link to={`/category/${data.name}`}>
        {" "}
        {/* ✅ Fixed: /category/:name */}
        <span>
          <h1>{data.title}</h1>
        </span>
        <img src={data.image} alt="" />
        <p>shop now</p>
      </Link>
    </div>
  );
}

export default CatagoryCard;
