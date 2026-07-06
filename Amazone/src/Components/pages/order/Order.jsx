import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import LayOut from "../../Layout/LayOut";
import CurrencyFormat from "../../CurrencyFormat/CurrencyFormat";
import styles from "./Order.module.css";
import { db } from "../../utility/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

function Order() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser) {
      navigate("/signup");
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");
        console.log("📦 Fetching orders for user:", currentUser.email);
        console.log("🆔 User UID:", currentUser.uid);

        if (!db) {
          console.error("❌ db is undefined!");
          setError("Firestore database not initialized.");
          setLoading(false);
          return;
        }

        const ordersRef = collection(db, "orders");
        console.log("✅ ordersRef created");

        // ✅ Query by userID (capital D)
        const q = query(
          ordersRef,
          where("userID", "==", currentUser.uid),
          orderBy("orderDate", "desc"),
        );

        console.log("✅ Query created");

        const querySnapshot = await getDocs(q);
        console.log("✅ QuerySnapshot size:", querySnapshot.size);

        if (querySnapshot.empty) {
          console.log("📦 No orders found for this user");
          setOrders([]);
          setLoading(false);
          return;
        }

        const fetchedOrders = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log("📄 Order doc:", doc.id, data);
          fetchedOrders.push({
            id: doc.id,
            orderId: doc.id,
            date: data.orderDate
              ? new Date(data.orderDate).toLocaleDateString()
              : "N/A",
            items: data.items || [],
            total: data.totalAmount || 0,
            totalQuantity: data.totalQuantity || 0,
            status: data.status || "Pending",
            paymentIntentId: data.paymentIntentId || "N/A",
          });
        });

        console.log("✅ Orders fetched:", fetchedOrders.length);
        setOrders(fetchedOrders);
        setLoading(false);
      } catch (error) {
        console.error("❌ Error fetching orders:", error);
        console.error("❌ Error code:", error.code);
        console.error("❌ Error message:", error.message);

        let errorMessage = "Failed to load your orders. Please try again.";
        if (error.code === "permission-denied") {
          errorMessage = "Permission denied. Please check Firestore rules.";
        } else if (error.code === "unavailable") {
          errorMessage =
            "Firestore is unavailable. Please check your internet connection.";
        } else if (error.code === "not-found") {
          errorMessage = "Orders collection not found.";
        }

        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser, navigate]);

  if (loading) {
    return (
      <LayOut>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <h2>Loading your orders...</h2>
        </div>
      </LayOut>
    );
  }

  if (error) {
    return (
      <LayOut>
        <div className={styles.errorContainer}>
          <h2>⚠️ {error}</h2>
          <p>Please check your connection and try again.</p>
          <button
            onClick={() => window.location.reload()}
            className={styles.retryBtn}
          >
            Try Again
          </button>
        </div>
      </LayOut>
    );
  }

  return (
    <LayOut>
      <div className={styles.orderContainer}>
        <div className={styles.orderHeader}>
          <h1>Your Orders</h1>
          <p className={styles.userEmail}>
            Logged in as: <strong>{currentUser?.email}</strong>
          </p>
        </div>

        {orders.length === 0 ? (
          <div className={styles.noOrders}>
            <div className={styles.noOrdersIcon}>📦</div>
            <h2>No orders found</h2>
            <p>You haven't placed any orders yet.</p>
            <p className={styles.noOrdersSubtext}>
              Start shopping to see your orders here!
            </p>
            <Link to="/" className={styles.shopBtn}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className={styles.orderList}>
            <div className={styles.orderCount}>
              Showing {orders.length} order{orders.length > 1 ? "s" : ""}
            </div>
            {orders.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderCardHeader}>
                  <div>
                    <span className={styles.orderId}>
                      Order #{order.orderId.slice(0, 8)}
                    </span>
                    <span className={styles.orderDate}>📅 {order.date}</span>
                  </div>
                  <span
                    className={`${styles.orderStatus} ${
                      styles[order.status.toLowerCase()]
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className={styles.orderDetails}>
                  <span>Items: {order.totalQuantity}</span>
                  <span>
                    Total: <CurrencyFormat amount={order.total} />
                  </span>
                </div>
                <div className={styles.orderItems}>
                  {order.items.slice(0, 3).map((item, index) => (
                    <span key={index} className={styles.orderItemTag}>
                      {item.title?.substring(0, 20)}...
                    </span>
                  ))}
                  {order.items.length > 3 && (
                    <span className={styles.orderItemTag}>
                      +{order.items.length - 3} more
                    </span>
                  )}
                </div>
                <div className={styles.orderPaymentId}>
                  <span>Payment ID: {order.paymentIntentId}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </LayOut>
  );
}

export default Order;
