const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 80;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

let count = 0;
let orders = [
  {
    id: "O202606160001",
    status: "待自提",
    payMode: "微信支付",
    fulfillment: "到店自提",
    amount: 83.78,
    storeName: "邻鲜云超 长宁店",
    pickupCode: "583921",
    createdAt: "2026-06-16 10:24",
    items: ["东北珍珠米", "精品鸡蛋"]
  }
];

const paymentConfig = {
  wechatPay: false,
  balancePay: true,
  pointsDeduction: true,
  cashOnDelivery: true
};

function createPickupCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function normalizeOrder(payload) {
  const now = new Date();
  const payMode = payload.payMode || "货到付款";
  return {
    id: payload.id || `O${Date.now()}`,
    status: payload.status || (payMode === "货到付款" ? "待自提" : "待备货"),
    payMode,
    fulfillment: payload.fulfillment || "到店自提",
    amount: Number(payload.amount || 0),
    storeName: payload.storeName || "邻鲜云超 长宁店",
    pickupCode: payload.pickupCode || createPickupCode(),
    createdAt: payload.createdAt || now.toLocaleString("zh-CN", { hour12: false }),
    items: Array.isArray(payload.items) ? payload.items : [],
    itemDetails: Array.isArray(payload.itemDetails) ? payload.itemDetails : []
  };
}

app.get("/", (req, res) => {
  res.json({
    ok: true,
    service: "supermarket-saas-backend",
    endpoints: ["/api/count", "/api/payment-config", "/api/orders"]
  });
});

app.post("/api/count", (req, res) => {
  if (req.body && req.body.action === "inc") count += 1;
  res.json({ ok: true, count });
});

app.get("/api/payment-config", (req, res) => {
  res.json(paymentConfig);
});

app.get("/api/orders", (req, res) => {
  res.json({ orders });
});

app.post("/api/orders", (req, res) => {
  const order = normalizeOrder(req.body || {});
  orders.unshift(order);
  res.status(201).json({ ok: true, order });
});

app.get("/api/orders/:id", (req, res) => {
  const order = orders.find((item) => item.id === req.params.id);
  if (!order) {
    res.status(404).json({ ok: false, message: "Order not found" });
    return;
  }
  res.json({ order });
});

app.listen(port, () => {
  console.log(`Supermarket SaaS backend listening on ${port}`);
});
