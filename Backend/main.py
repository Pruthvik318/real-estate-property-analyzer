from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import random
import os
from dotenv import load_dotenv
from typing import List, Optional

# LangChain and Gemini imports
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
from langchain_core.prompts import PromptTemplate
from PIL import Image

# -------------------------------
# LOAD ENVIRONMENT VARIABLES
# -------------------------------
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Initialize Gemini
llm = ChatGoogleGenerativeAI(model="gemini-flash-latest", google_api_key=GEMINI_API_KEY)
vision_llm = ChatGoogleGenerativeAI(model="gemini-flash-latest", google_api_key=GEMINI_API_KEY)


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

# -------------------------------
# STATIC FILES
# -------------------------------
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_FOLDER), name="uploads")



def save_file(file: UploadFile):
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    
    # Ensure forward slashes for URL compatibility even on Windows
    url_path = file_path.replace("\\", "/")

    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())

    return url_path


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


async def analyze_property_with_vision(image_paths: List[str]):
    """
    Uses Vision LLM to extract features from property images.
    """
    # Simply using the first image for analysis for now
    if not image_paths:
        return None
    
    image_path = image_paths[0]
    if not os.path.exists(image_path):
        return None

    # Using ChatGoogleGenerativeAI with Vision
    import base64

    def encode_image(img_path):
        with open(img_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')

    try:
        base64_image = encode_image(image_path)
        
        message = HumanMessage(
            content=[
                {"type": "text", "text": "Analyze this real estate property image. Extract: estimated room count (just an integer), overall condition (Excellent/Good/Fair/Poor), architectural style (Modern/Traditional/Art Deco/etc), and a list of 5 key features. Format your response STRICTLY as JSON with these keys: room_count, condition, style, features."},
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"},
                },
            ]
        )
        
        response = vision_llm.invoke([message])
        
        # Handle cases where content might be a list (common in some langchain-google-genai versions)
        content_text = response.content
        if isinstance(content_text, list):
            content_text = "".join([c.get("text", "") if isinstance(c, dict) else str(c) for c in content_text])
            
        # Extract JSON from response
        import json
        import re

        
        # Sometimes LLM wraps JSON in ```json ... ```
        json_match = re.search(r'\{.*\}', content_text, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
        return None
    except Exception as e:
        print(f"Vision Analysis Error: {e}")
        return None

async def generate_property_description(property_metadata: dict, analysis_data: dict):
    """
    Uses Text LLM to generate a professional property description.
    """
    prompt_template = PromptTemplate.from_template(
        """
        You are a professional real estate copywriter. 
        Generate a compelling, high-end property description for the following property:
        
        Name: {name}
        Address: {address}
        Room Count: {room_count}
        Condition: {condition}
        Style: {style}
        Key Features: {features}
        
        The description should be professional, inviting, and approximately 3-4 paragraphs.
        Focus on selling the lifestyle and highlighting the unique features discovered by our AI.
        """
    )
    
    chain = prompt_template | llm
    
    features = analysis_data.get("features", [])
    features_str = ", ".join(features) if isinstance(features, list) else str(features)
    
    response = chain.invoke({
        "name": property_metadata["name"],
        "address": property_metadata["address"],
        "room_count": analysis_data.get("room_count", "N/A"),
        "condition": analysis_data.get("condition", "N/A"),
        "style": analysis_data.get("style", "N/A"),
        "features": features_str
    })
    
    content = response.content
    if isinstance(content, list):
        content = "".join([c.get("text", "") if isinstance(c, dict) else str(c) for c in content])
        
    return content

@app.post("/api/properties/{property_id}/analyze")
async def reanalyze_property(property_id: int):
    # 1. Get property details
    property_data, existing_analysis = get_property_by_id(property_id)
    if not property_data:
        raise HTTPException(status_code=404, detail="Property not found")
    
    # 2. Extract features using Vision LLM
    image_paths = [property_data["main_image"]]
    if property_data["floor_plan"]:
        image_paths.append(property_data["floor_plan"])
        
    analysis_results = await analyze_property_with_vision(image_paths)
    if not analysis_results:
        raise HTTPException(status_code=500, detail="Failed to analyze images")
    
    # 3. Generate description using Text LLM
    description = await generate_property_description(dict(property_data), analysis_results)
    
    # 4. Update database
    conn = get_connection()
    cursor = conn.cursor()
    
    # Store description
    cursor.execute(
        "UPDATE properties SET description = ? WHERE id = ?",
        (description, property_id)
    )
    
    # Store analysis
    features = analysis_results.get("features", [])
    features_str = ", ".join(features) if isinstance(features, list) else str(features)
    
    if existing_analysis:
        cursor.execute(
            """
            UPDATE property_analysis 
            SET room_count = ?, condition = ?, style = ?, features = ?
            WHERE property_id = ?
            """,
            (analysis_results.get("room_count"), analysis_results.get("condition"), 
             analysis_results.get("style"), features_str, property_id)
        )
    else:
        cursor.execute(
            """
            INSERT INTO property_analysis (property_id, room_count, condition, style, features)
            VALUES (?, ?, ?, ?, ?)
            """,
            (property_id, analysis_results.get("room_count"), analysis_results.get("condition"), 
             analysis_results.get("style"), features_str)
        )
    
    conn.commit()
    conn.close()
    
    # Format analysis results for response (consistency with fetch_property)
    if isinstance(analysis_results.get("features"), str):
        analysis_results["features"] = [f.strip() for f in analysis_results["features"].split(",")]
    
    return {
        "description": description,
        "analysis": analysis_results
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
