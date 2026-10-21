from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="QuantumShop Product Service")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

products = [
    {"id": 1, "name": "ASUS ROG Strix G16", "price": 145000, "category": "Laptop", "brand": "ASUS"},
    {"id": 2, "name": "Lenovo Legion 5", "price": 125000, "category": "Laptop", "brand": "Lenovo"},
    {"id": 3, "name": "HP Omen 16", "price": 135000, "category": "Laptop", "brand": "HP"},
    {"id": 4, "name": "Acer Predator Helios", "price": 118000, "category": "Laptop", "brand": "Acer"},
    {"id": 5, "name": "MSI Katana 15", "price": 110000, "category": "Laptop", "brand": "MSI"},
    {"id": 6, "name": "Dell G15 Gaming", "price": 105000, "category": "Laptop", "brand": "Dell"},
    {"id": 7, "name": "Logitech G502 Hero", "price": 4999, "category": "Mouse", "brand": "Logitech"},
    {"id": 8, "name": "Razer DeathAdder V3", "price": 6999, "category": "Mouse", "brand": "Razer"},
    {"id": 9, "name": "Redragon K552 Keyboard", "price": 3999, "category": "Keyboard", "brand": "Redragon"},
    {"id": 10, "name": "Razer BlackWidow V4", "price": 14999, "category": "Keyboard", "brand": "Razer"},
    {"id": 11, "name": "Samsung Odyssey G5", "price": 32000, "category": "Monitor", "brand": "Samsung"},
    {"id": 12, "name": "LG UltraGear 27", "price": 28000, "category": "Monitor", "brand": "LG"}
]

@app.get("/")
def home():
    return {"service": "product", "status": "running"}

@app.get("/products")
def get_products():
    return {"success": True, "total_products": len(products), "data": products}

@app.get("/products/{product_id}")
def get_product(product_id: int):
    p = next((p for p in products if p["id"] == product_id), None)
    return {"success": bool(p), "product": p} if p else {"success": False, "message": "Product not found"}
