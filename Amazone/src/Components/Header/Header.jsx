import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useAuth } from "../pages/Auth/AuthContext";
import { FaSearch } from "react-icons/fa";
import { PiShoppingCartSimple } from "react-icons/pi";
import { IoLocationOutline } from "react-icons/io5";
import Class from "./Header.module.css";
import LowerHeader from "./LowerHeader";
import Flag from "../../assets/images/america_flag.png";

function Header() {
  const totalQuantity = useSelector((state) => state.totalQuantity);
  const { currentUser, logout } = useAuth();

  return (
    <section>
      <div className={Class.header_contianer}>
        <div className={Class.logo_contianer}>
          <Link to="/">
            <img
              src="https://pngimg.com/uploads/amazon/amazon_PNG11.png"
              alt="amazonlogo"
            />
          </Link>
          <div className={Class.delivery}>
            <span>
              <IoLocationOutline />
            </span>
            <p>deliver to</p>
            <span>Ethiopia</span>
          </div>
        </div>
        <div className={Class.search}>
          <select name="" id="">
            <option value="">All</option>
          </select>
          <input type="text" placeholder="Search Amazon" id="" />
          <FaSearch size={25} />
        </div>
        <div className={Class.order_container}>
          <div className={Class.language}>
            <img src={Flag} alt="flag" />
            <select name="" id="">
              <option value="">EN</option>
            </select>
          </div>
          {currentUser ? (
            <div className={Class.userInfo}>
              <Link to="/signup">
                <p>Hello, {currentUser.email?.split("@")[0]}</p>
                <span>Account & Lists</span>
              </Link>
              <button onClick={logout} className={Class.logoutBtn}>
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/signup">
              <p>Signup</p>
              <span>Account & Lists</span>
            </Link>
          )}
          <Link to="/orders">
            <p>returns</p>
            <span>& Orders</span>
          </Link>
          <Link to="/cart" className={Class.cart}>
            <PiShoppingCartSimple size={35} />
            <span>{totalQuantity}</span>
          </Link>
        </div>
      </div>
      <LowerHeader />
    </section>
  );
}

export default Header;
