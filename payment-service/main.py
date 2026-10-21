from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from uuid import uuid4

app = FastAPI(title="QuantumShop Payment Service")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

class Payment(BaseModel):
    amount: float
    payment_method: str = "UPI"

@app.get("/")
def home():
    return {"service":"payment", "status":"running"}

@app.post("/payment")
def pay(data: Payment):
    if data.amount <= 0:
        return {"success":False, "message":"Amount must be positive"}
    return {"success":True, "transaction_id":str(uuid4())[:8].upper(),
            "amount":data.amount, "payment_method":data.payment_method,
            "status":"DEMO_SUCCESS", "note":"Demo only; no real payment was charged."}
