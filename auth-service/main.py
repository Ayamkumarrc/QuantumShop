from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import sqlite3, hashlib, os

app = FastAPI(title="QuantumShop Auth Service")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
DB = os.getenv("AUTH_DB", os.path.join(os.path.dirname(__file__), "users.db"))
os.makedirs(os.path.dirname(DB), exist_ok=True)

def init_db():
    with sqlite3.connect(DB) as conn:
        conn.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT UNIQUE, password_hash TEXT)")

init_db()

class Credentials(BaseModel):
    email: str
    password: str = Field(min_length=6)

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

@app.get("/")
def home():
    return {"service":"auth", "status":"running"}

@app.post("/auth/register")
def register(data: Credentials):
    try:
        with sqlite3.connect(DB) as conn:
            conn.execute("INSERT INTO users(email,password_hash) VALUES (?,?)",
                         (data.email.lower(), hash_password(data.password)))
        return {"success":True, "message":"User registered"}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=409, detail="Email already registered")

@app.post("/auth/login")
def login(data: Credentials):
    with sqlite3.connect(DB) as conn:
        row = conn.execute("SELECT id,password_hash FROM users WHERE email=?",
                           (data.email.lower(),)).fetchone()
    if not row or row[1] != hash_password(data.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"success":True, "user_id":row[0], "email":data.email.lower(),
            "message":"Demo login successful"}
