import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import LayOut from "../../Layout/LayOut";
import CurrencyFormat from "../../CurrencyFormat/CurrencyFormat";
import styles from "./Payment.module.css";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { stripeApi } from "../../../api/axios";
import { clearCart } from "../../utility/actions";
import { db } from "../../utility/firebase";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";

function PaymentForm({ totalAmount, onSuccess, currentUser }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        console.log("💳 Creating payment intent for amount:", totalAmount);

        const response = await stripeApi.createPaymentIntent({
          amount: totalAmount,
          currency: "usd",
          metadata: {
            userId: currentUser?.uid || "guest",
            userEmail: currentUser?.email || "guest@email.com",
          },
        });

        console.log("✅ Payment intent created:", response.data);
        setClientSecret(response.data.clientSecret);
      } catch (err) {
        console.error("❌ Error:", err);
        setError(
          err.response?.data?.error ||
            "Cannot connect to payment server. Please make sure the backend is running.",
        );
      }
    };

    if (totalAmount > 0) {
      createPaymentIntent();
    }
  }, [totalAmount, currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      setError("Payment system not ready. Please try again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const cardElement = elements.getElement(CardElement);
      const billingPostalCode = "10001";

      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: currentUser?.displayName || "Customer",
              email: currentUser?.email || "",
              address: {
                postal_code: billingPostalCode,
              },
            },
          },
        });

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        console.log("✅ Payment successful!", paymentIntent);
        onSuccess(paymentIntent);
      }
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label>Card Details</label>
        <div className={styles.cardElement}>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#0f1111",
                  "::placeholder": { color: "#999" },
                },
              },
            }}
          />
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <button
        type="submit"
        disabled={!stripe || loading || !clientSecret}
        className={styles.payBtn}
      >
        {loading ? "Processing..." : `Pay `}
        {!loading && <CurrencyFormat amount={totalAmount} />}
      </button>
    </form>
  );
}

function Payment() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cartItems);
  const totalAmount = useSelector((state) => state.totalAmount);
  const totalQuantity = useSelector((state) => state.totalQuantity);
  const [savingOrder, setSavingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

  useEffect(() => {
    if (!currentUser) {
      navigate("/signup", { state: { from: "/payment" } });
    }
  }, [currentUser, navigate]);

  const saveOrderToFirestore = async (paymentIntent) => {
    try {
      setSavingOrder(true);
      setOrderError("");
      console.log("📦 Saving order to Firestore...");
      console.log("🔍 currentUser.uid:", currentUser?.uid);

      if (!db) {
        throw new Error("Firestore database not initialized");
      }

      if (!cartItems || cartItems.length === 0) {
        throw new Error("No items in cart to save");
      }

      const orderData = {
        userID: currentUser.uid,
        userEmail: currentUser.email,
        items: cartItems.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
          image: item.image,
        })),
        totalAmount: totalAmount,
        totalQuantity: totalQuantity,
        orderDate: new Date().toISOString(),
        status: "Paid",
        paymentIntentId: paymentIntent.id,
        paymentStatus: paymentIntent.status,
      };

      console.log("📦 Order data being saved:", orderData);

      const ordersCollection = collection(db, "orders");
      const docRef = await addDoc(ordersCollection, orderData);
      console.log("✅ Order saved with ID:", docRef.id);

      try {
        const userOrdersCollection = collection(
          db,
          "users",
          currentUser.uid,
          "orders",
        );
        const userOrderRef = doc(userOrdersCollection, docRef.id);
        await setDoc(userOrderRef, {
          orderId: docRef.id,
          totalAmount: totalAmount,
          orderDate: new Date().toISOString(),
          status: "Paid",
        });
        console.log("✅ User order reference saved");
      } catch (userError) {
        console.warn("⚠️ Could not save to user subcollection:", userError);
      }

      setSavingOrder(false);
      return docRef.id;
    } catch (error) {
      console.error("❌ Error saving order to Firestore:", error);
      setOrderError(`Failed to save order: ${error.message}`);
      setSavingOrder(false);
      return null;
    }
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    console.log("✅ Payment successful:", paymentIntent);

    const orderId = await saveOrderToFirestore(paymentIntent);

    dispatch(clearCart());
    console.log("🛒 Cart cleared after successful payment");

    if (orderId) {
      alert(
        `✅ Payment successful! Order #${orderId} placed for ${currentUser?.email}!`,
      );
    } else {
      alert(
        `⚠️ Payment successful but order was not saved! Please contact support.`,
      );
    }

    navigate("/orders");
  };

  if (cartItems.length === 0) {
    return (
      <LayOut>
        <div className={styles.emptyPayment}>
          <h2>Your Cart is Empty</h2>
          <p>Please add items to your cart before proceeding to payment.</p>
          <Link to="/" className={styles.shopBtn}>
            Continue Shopping
          </Link>
        </div>
      </LayOut>
    );
  }

  return (
    <LayOut>
      <div className={styles.paymentContainer}>
        <div className={styles.cartHeader}>
          <h1>Payment</h1>
          <span className={styles.itemCount}>{totalQuantity} items</span>
        </div>

        <div className={styles.userInfo}>
          <p>
            Checking out as: <strong>{currentUser?.email || "Guest"}</strong>
          </p>
        </div>

        <div className={styles.paymentContent}>
          <div className={styles.orderSummary}>
            <h2>Order Summary</h2>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.orderItem}>
                <img src={item.image} alt={item.title} />
                <div>
                  <p>
                    {item.title.length > 30
                      ? item.title.substring(0, 30) + "..."
                      : item.title}
                  </p>
                  <p>Qty: {item.quantity}</p>
                </div>
                <CurrencyFormat amount={item.totalPrice} />
              </div>
            ))}
            <div className={styles.summaryDivider}></div>
            <div className={styles.orderTotal}>
              <span>Total ({totalQuantity} items)</span>
              <span>
                <CurrencyFormat amount={totalAmount} />
              </span>
            </div>
          </div>

          <div className={styles.paymentForm}>
            <h2>Payment Details</h2>
            {savingOrder && (
              <div className={styles.savingMessage}>
                ⏳ Saving your order...
              </div>
            )}
            {orderError && (
              <div className={styles.orderError}>⚠️ {orderError}</div>
            )}
            <PaymentForm
              totalAmount={totalAmount}
              onSuccess={handlePaymentSuccess}
              currentUser={currentUser}
            />
          </div>
        </div>
      </div>
    </LayOut>
  );
}

export default Payment;
