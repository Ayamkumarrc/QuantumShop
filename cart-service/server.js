const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

let cart = [];
let nextId = 1;

app.get("/", (req, res) => res.json({service:"cart", status:"running"}));
app.get("/cart", (req, res) => res.json({success:true, cart}));
app.post("/cart", (req, res) => {
  const {product_id, name, price, quantity = 1} = req.body;
  if (!name || price === undefined) return res.status(400).json({success:false, message:"name and price required"});
  const item = {id:nextId++, product_id, name, price:Number(price), quantity:Math.max(1, Number(quantity))};
  cart.push(item);
  res.json({success:true, message:"Added to cart", item, cart});
});
app.delete("/cart/:id", (req, res) => {
  cart = cart.filter(item => item.id !== Number(req.params.id));
  res.json({success:true, cart});
});
app.delete("/cart", (req, res) => {
  cart = [];
  res.json({success:true, message:"Cart cleared"});
});
app.listen(3000, "0.0.0.0", () => console.log("Cart service on port 3000"));
