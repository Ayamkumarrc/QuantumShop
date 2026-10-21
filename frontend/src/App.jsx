import { useEffect, useState } from "react";
import "./App.css";

const API = {
  products: "http://localhost:8000",
  cart: "http://localhost:3000",
  payment: "http://localhost:8001",
  auth: "http://localhost:8002",
};

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [amount, setAmount] = useState(0);

  async function loadProducts() {
    try {
      const r = await fetch(`${API.products}/products`);
      const data = await r.json();
      setProducts(data.data || []);
    } catch {
      setMessage("Product service connect nahi ho rahi.");
    } finally {
      setLoading(false);
    }
  }

  async function loadCart() {
    try {
      const r = await fetch(`${API.cart}/cart`);
      const data = await r.json();
      setCart(data.cart || []);
    } catch {
      setMessage("Cart service connect nahi ho rahi.");
    }
  }

  useEffect(() => {
    loadProducts();
    loadCart();
  }, []);

  async function addToCart(product) {
    try {
      const r = await fetch(`${API.cart}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message || "Add failed");
      setMessage(`${product.name} cart mein add ho gaya!`);
      await loadCart();
    } catch (e) {
      setMessage(e.message);
    }
  }

  async function removeItem(id) {
    try {
      await fetch(`${API.cart}/cart/${id}`, { method: "DELETE" });
      await loadCart();
    } catch {
      setMessage("Cart item remove nahi hua.");
    }
  }

  async function checkout() {
    const total = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);
    if (!cart.length || total <= 0) {
      setMessage("Checkout se pehle cart mein product add karein.");
      return;
    }
    try {
      const r = await fetch(`${API.payment}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total, payment_method: "UPI" }),
      });
      const data = await r.json();
      if (!r.ok || !data.success) throw new Error("Payment demo failed");
      setAmount(total);
      setMessage(`Demo order successful! Transaction: ${data.transaction_id}. Real payment nahi hua.`);
      await fetch(`${API.cart}/cart`, { method: "DELETE" });
      await loadCart();
    } catch (e) {
      setMessage(e.message || "Payment service connect nahi ho rahi.");
    }
  }

  async function authAction(action) {
    try {
      const r = await fetch(`${API.auth}/auth/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.detail || "Authentication failed");
      setMessage(data.message || "Success");
    } catch (e) {
      setMessage(e.message || "Auth service connect nahi ho rahi.");
    }
  }

  const money = (n) => "₹" + Number(n).toLocaleString("en-IN");
  const total = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#">TECH<span>LAP</span></a>
        <nav><a href="#products">Products</a><a href="#account">Account</a></nav>
        <a className="cart-link" href="#cart">🛒 Cart ({cart.length})</a>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">LEVEL UP YOUR GAME</p>
            <h1>Power Your<br /><span>Next Level.</span></h1>
            <p>Gaming laptops, peripherals and gear for your setup.</p>
            <a className="primary-btn" href="#products">Explore Products →</a>
          </div>
          <div className="hero-art">⚡<div>GAMING<br />PERFORMANCE</div></div>
        </section>

        {message && (
          <div className="notice">
            <span>{message}</span>
            <button onClick={() => setMessage("")}>✕</button>
          </div>
        )}

        <section id="products" className="section">
          <div className="section-heading">
            <div><p className="eyebrow">OUR COLLECTION</p><h2>Featured Gear</h2></div>
            <span>{products.length} products</span>
          </div>
          {loading ? <p>Loading products...</p> : products.length === 0 ?
            <p>No products found. Check Product Service.</p> :
            <div className="product-grid">
              {products.map((p) => (
                <article className="product-card" key={p.id}>
                  <div className="product-image">
                    {p.category === "Laptop" ? "💻" : p.category === "Mouse" ? "🖱️" : p.category === "Keyboard" ? "⌨️" : "🖥️"}
                    <span>{p.category}</span>
                  </div>
                  <div className="product-info">
                    <p className="muted">{p.brand || "TechLap"}</p>
                    <h3>{p.name}</h3>
                    <div className="product-bottom">
                      <strong>{money(p.price)}</strong>
                      <button onClick={() => addToCart(p)}>+ Add</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          }
        </section>

        <section id="cart" className="section cart-section">
          <div className="section-heading">
            <div><p className="eyebrow">YOUR SELECTION</p><h2>Shopping Cart</h2></div>
            <button className="secondary-btn" onClick={loadCart}>Refresh</button>
          </div>
          {cart.length === 0 ? <p className="muted">Your cart is empty. Add some gaming gear!</p> :
            <>
              {cart.map((item) => (
                <div className="cart-row" key={item.id}>
                  <div><strong>{item.name}</strong><p className="muted">Qty: {item.quantity}</p></div>
                  <strong>{money(item.price * item.quantity)}</strong>
                  <button className="remove-btn" onClick={() => removeItem(item.id)}>Remove</button>
                </div>
              ))}
              <div className="cart-total"><span>Total</span><strong>{money(total)}</strong></div>
              <button className="primary-btn checkout" onClick={checkout}>Checkout with Demo Payment</button>
            </>
          }
        </section>

        <section id="account" className="section account-section">
          <p className="eyebrow">YOUR TECHLAP ACCOUNT</p>
          <h2>Register or Login</h2>
          <p className="muted">Demo authentication service</p>
          <div className="auth-form">
            <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Password (minimum 6 characters)" value={password} onChange={e => setPassword(e.target.value)} />
            <button onClick={() => authAction("register")}>Register</button>
            <button className="secondary-btn" onClick={() => authAction("login")}>Login</button>
          </div>
        </section>
      </main>

      <footer><a className="brand" href="#">TECH<span>LAP</span></a><p>Gaming gear. Next-level performance.</p><small>Student project • Demo checkout only</small></footer>
    </div>
  );
}
