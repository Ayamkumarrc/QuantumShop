const express = require("express");
const axios = require("axios");
const sqlite3 = require("sqlite3").verbose();

const app = express();

app.use(express.json());

// SQLite Database
const db = new sqlite3.Database("./cart.db", (err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("SQLite Database Connected");
    }
});

// Create cart table
db.run(`
    CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        price INTEGER NOT NULL,
        quantity INTEGER NOT NULL
    )
`);

// Home
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to SmartMart Cart Service",
        status: "Running Successfully"
    });
});

// Get Cart
app.get("/cart", (req, res) => {
    db.all("SELECT * FROM cart", [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        res.json({
            success: true,
            total_items: rows.length,
            cart: rows
        });
    });
});

// Add Product to Cart
app.post("/cart", async (req, res) => {
    try {
        const { product_id, quantity } = req.body;

        // Get product from Product Service
        const response = await axios.get(
            `http://127.0.0.1:8000/products/${product_id}`
        );

        const product = response.data.product;

        const itemQuantity = quantity || 1;

        // Save product in database
        db.run(
            `INSERT INTO cart (product_id, name, price, quantity)
             VALUES (?, ?, ?, ?)`,
            [
                product.id,
                product.name,
                product.price,
                itemQuantity
            ],
            function (err) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: "Failed to save product"
                    });
                }

                res.json({
                    success: true,
                    message: "Product Added to Cart Successfully",
                    item: {
                        id: this.lastID,
                        product_id: product.id,
                        name: product.name,
                        price: product.price,
                        quantity: itemQuantity
                    }
                });
            }
        );

    } catch (error) {
        res.status(404).json({
            success: false,
            message: "Product not found or Product Service is not running"
        });
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Cart Service Running on Port ${PORT}`);
});