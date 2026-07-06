import React from "react";
import { IoReorderThree } from "react-icons/io5";
import Class from "./Header.module.css";
function LowerHeader() {
  return (
    <div className={Class.lower_container}>
      <ul>
        <li>
          <IoReorderThree />
          <p>All</p>
        </li>
        <li>Today's Deals</li>
        <li>Costumer Service</li>
        <li>Rigstory</li>
        <li>Gift Cards</li>
        <li>Sell</li>
      </ul>
    </div>
  );
}

export default LowerHeader;
