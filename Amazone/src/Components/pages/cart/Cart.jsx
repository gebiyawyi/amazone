import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import LayOut from "../../Layout/LayOut";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} from "../../utility/actions";
import CurrencyFormat from "../../CurrencyFormat/CurrencyFormat";
import styles from "./Cart.module.css";

function Cart() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cartItems);
  const totalAmount = useSelector((state) => state.totalAmount);
  const totalQuantity = useSelector((state) => state.totalQuantity);

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleIncreaseQuantity = (productId) => {
    dispatch(increaseQuantity(productId));
  };

  const handleDecreaseQuantity = (productId) => {
    dispatch(decreaseQuantity(productId));
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      dispatch(clearCart());
    }
  };

  if (cartItems.length === 0) {
    return (
      <LayOut>
        <div className={styles.emptyCart}>
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <Link to="/" className={styles.shopNowBtn}>
            Shop Now
          </Link>
        </div>
      </LayOut>
    );
  }

  return (
    <LayOut>
      <div className={styles.cartContainer}>
        <div className={styles.cartHeader}>
          <h1>Shopping Cart</h1>
          <span className={styles.itemCount}>{totalQuantity} items</span>
        </div>

        <div className={styles.cartContent}>
          <div className={styles.cartItems}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemImage}>
                  <img src={item.image} alt={item.title} />
                </div>

                <div className={styles.itemDetails}>
                  <h3 className={styles.itemTitle}>{item.title}</h3>
                  <p className={styles.itemPrice}>
                    <CurrencyFormat amount={item.price} />
                  </p>

                  <div className={styles.quantityControls}>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => handleDecreaseQuantity(item.id)}
                    >
                      −
                    </button>
                    <span className={styles.qtyCount}>{item.quantity}</span>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => handleIncreaseQuantity(item.id)}
                    >
                      +
                    </button>
                  </div>

                  <div className={styles.itemTotal}>
                    Total: <CurrencyFormat amount={item.totalPrice} />
                  </div>

                  <button
                    className={styles.removeBtn}
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.cartSummary}>
            <h2>Order Summary</h2>
            <div className={styles.summaryRow}>
              <span>Items ({totalQuantity})</span>
              <span>
                <CurrencyFormat amount={totalAmount} />
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span>Delivery</span>
              <span style={{ color: "#067d62" }}>FREE</span>
            </div>
            <div className={styles.summaryDivider}></div>
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>
                <CurrencyFormat amount={totalAmount} />
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span style={{ fontSize: "14px", color: "#565959" }}>
                Inclusive of all taxes
              </span>
            </div>
            <Link to="/payment" className={styles.proceedLink}>
              <button className={styles.proceedBtn}>Proceed to Checkout</button>
            </Link>
            <button className={styles.clearCartBtn} onClick={handleClearCart}>
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </LayOut>
  );
}

export default Cart;
