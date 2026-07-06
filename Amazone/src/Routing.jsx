import { Routes, Route } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Landing from "./Components/pages/landing/Landing";
import Payment from "./Components/pages/payment/Payment";
import Auth from "./Components/pages/Auth/Auth";
import Order from "./Components/pages/order/Order";
import Cart from "./Components/pages/cart/Cart";
import Productdetail from "./Components/pages/productdetail/Productdetail";
import Result from "./Components/pages/results/Result";
import ProtectedRoute from "./Components/protectedroute/ProtectedRoute";

const stripePromise = loadStripe(
  "pk_test_51Tpm802EhWO7P1YiUph0dA6A5HSZQUPr6z7amp1cJgXz7Y9wM2XvvJNvBk1v2kWbuqc7SAms65rtQCSLHMdkn6g000TOhfYKGO",
);

function Routing() {
  return (
    <Routes>
      {/* Public Routes - Anyone can access */}
      <Route path="/" element={<Landing />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="/signup" element={<Auth />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/productdetail/:productId" element={<Productdetail />} />
      <Route path="/category/:categoryName" element={<Result />} />

      {/* Protected Routes - Require Login */}
      <Route
        path="/payment"
        element={
          <ProtectedRoute>
            <Elements stripe={stripePromise}>
              <Payment />
            </Elements>
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Order />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default Routing;
