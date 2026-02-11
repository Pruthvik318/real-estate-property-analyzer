from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import random
import os

# -------------------------------
# DATABASE IMPORTS
# -------------------------------
from database.database import create_tables, get_connection

# -------------------------------
# FASTAPI APP
# -------------------------------
app = FastAPI(title="Internship Project Backend")

# -------------------------------
# CREATE DATABASE TABLES
# -------------------------------
create_tables()

# -------------------------------
# CORS CONFIGURATION
# -------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# FILE UPLOAD CONFIG
# -------------------------------
UPLOAD_FOLDER = "uploads"


def save_file(file: UploadFile):
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())

    return file_path


def get_property_by_id(property_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM properties WHERE id = ?",
        (property_id,)
    )

    property_data = cursor.fetchone()

    cursor.execute(
        "SELECT * FROM property_analysis WHERE property_id = ?",
        (property_id,)
    )

    analysis = cursor.fetchone()

    conn.close()

    return property_data, analysis


@app.get("/api/properties")
def fetch_all_properties():
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM properties")
    rows = cursor.fetchall()
    
    conn.close()
    
    properties = []
    for row in rows:
        properties.append({
            "id": row["id"],
            "name": row["name"],
            "address": row["address"],
            "mainImage": row["main_image"],
            "floorPlan": row["floor_plan"]
        })
        
    return properties


@app.get("/api/properties/{property_id}")
def fetch_property(property_id: int):

    property_data, analysis = get_property_by_id(property_id)

    if not property_data:
        return {"error": "Property not found"}

    # Convert analysis to dict and handle features which might be a comma-separated string
    analysis_dict = dict(analysis) if analysis else None
    if analysis_dict and analysis_dict.get("features"):
        analysis_dict["features"] = [f.strip() for f in analysis_dict["features"].split(",")]

    return {
        "id": property_data["id"],
        "name": property_data["name"],
        "address": property_data["address"],
        "mainImage": property_data["main_image"],
        "floorPlan": property_data["floor_plan"],
        "description": property_data["description"],
        "valuation": property_data["valuation"],
        "valuation_reasoning": property_data["valuation_reasoning"],
        "analysis": analysis_dict
    }





# -------------------------------
# ROOT ENDPOINT
# -------------------------------
@app.get("/")
def read_root():
    return {"message": "Backend is running successfully"}

# -------------------------------
# HEALTH CHECK
# -------------------------------
@app.get("/health")
def health_check():
    return {"status": "ok"}

# -------------------------------
# SAMPLE RANDOM QUOTE ENDPOINT
# -------------------------------
@app.get("/api/random-quote")
def random_quote():
    quotes = [
        "Real estate cannot be lost or stolen, nor can it be carried away.",
        "The best investment on Earth is earth.",
        "Buy land, they’re not making it anymore.",
        "Owning a home is a keystone of wealth.",
        "Landlords grow rich in their sleep."
    ]

    return {"quote": random.choice(quotes)}

# -------------------------------
# PROPERTY UPLOAD ENDPOINT (ISSUE 9)
# -------------------------------
@app.post("/api/properties")
async def create_property(
    name: str = Form(...),
    address: str = Form(...),
    mainImage: UploadFile = File(...),
    floorPlan: UploadFile = File(None)
):
    # Save images
    main_image_path = save_file(mainImage)

    floor_plan_path = None
    if floorPlan:
        floor_plan_path = save_file(floorPlan)

    # Save property data to database
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO properties (name, address, main_image, floor_plan)
        VALUES (?, ?, ?, ?)
        """,
        (name, address, main_image_path, floor_plan_path)
    )

    conn.commit()
    conn.close()

    return {
        "message": "Property uploaded successfully"
    }
