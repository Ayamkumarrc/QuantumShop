from fastapi import FastAPI

app = FastAPI(
    title="SmartMart Product Service",
    description="Product Management API for SmartMart E-Commerce",
    version="1.0.0"
)

# Developed by Ayam Kumar

products = [
    {
        "id": 1,
        "name": "Gaming Laptop",
        "price": 95000
    },
    {
        "id": 2,
        "name": "Wireless Mouse",
        "price": 1999
    },
    {
        "id": 3,
        "name": "Mechanical Keyboard",
        "price": 4999
    },
    {
        "id": 4,
        "name": "27 Inch Monitor",
        "price": 18000
    }
]


@app.get("/")
def home():
    return {
        "message": "Welcome to SmartMart API",
        "developer": "Ayam Kumar",
        "version": "1.0.0",
        "status": "Running Successfully"
    }


@app.get("/products")
def get_products():
    return {
        "success": True,
        "total_products": len(products),
        "data": products
    }


@app.get("/products/{product_id}")
def get_product(product_id: int):
    for product in products:
        if product["id"] == product_id:
            return {
                "success": True,
                "product": product
            }

    return {
        "success": False,
        "message": "Product Not Found"
    }


@app.post("/products")
def add_product(product: dict):
    products.append(product)

    return {
        "success": True,
        "message": "Product Added Successfully",
        "product": product
    }


@app.put("/products/{product_id}")
def update_product(product_id: int, updated_product: dict):
    for product in products:
        if product["id"] == product_id:
            product["name"] = updated_product["name"]
            product["price"] = updated_product["price"]

            return {
                "message": "Product Updated Successfully",
                "product": product
            }

    return {
        "message": "Product Not Found"
    }


@app.delete("/products/{product_id}")
def delete_product(product_id: int):
    for product in products:
        if product["id"] == product_id:
            products.remove(product)

            return {
                "message": "Product Deleted Successfully"
            }

    return {
        "message": "Product Not Found"
    }