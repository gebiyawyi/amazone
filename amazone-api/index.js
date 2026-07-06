const express = require("express");
const cors = require("cors");

// ✅ No dotenv needed - Render uses environment variables
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Stripe API is running!",
    stripeKeyLoaded: !!process.env.STRIPE_SECRET_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Create Payment Intent
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency = "usd", metadata = {} } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency,
      metadata: { ...metadata },
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        endpointSecret,
      );

      if (event.type === "payment_intent.succeeded") {
        console.log("✅ Payment successful:", event.data.object.id);
      }

      res.status(200).json({ received: true });
    } catch (error) {
      console.error("Webhook error:", error);
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }
  },
);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
