from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random

app = FastAPI(title="Internship Project Backend")

# -------------------------------------------------
# CORS CONFIGURATION (VERY IMPORTANT)
# -------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------
# ROOT ENDPOINT
# -------------------------------------------------
@app.get("/")
def read_root():
    return {"message": "Backend is running successfully"}

# -------------------------------------------------
# HEALTH CHECK
# -------------------------------------------------
@app.get("/health")
def health_check():
    return {"status": "ok"}

# -------------------------------------------------
# SAMPLE RANDOM QUOTE ENDPOINT
# -------------------------------------------------
@app.get("/api/random-quote")
def random_quote():
    quotes = [
        "Real estate cannot be lost or stolen, nor can it be carried away.",
        "The best investment on Earth is earth.",
        "Buy land, they’re not making it anymore.",
        "Owning a home is a keystone of wealth.",
        "Landlords grow rich in their sleep."
    ]

    return {
        "quote": random.choice(quotes)
    }
