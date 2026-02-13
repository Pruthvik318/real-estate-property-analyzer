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
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash-lite", google_api_key=GEMINI_API_KEY)
vision_llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash-lite", google_api_key=GEMINI_API_KEY)


# -------------------------------
# UTILITY IMPORTS
# -------------------------------
from utils import retry_with_backoff

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
    allow_origins=["*"],  # Allow all origins for production (or specify production URL)
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
            "floorPlan": row["floor_plan"],
            "propertyType": row["property_type"],
            "valuation": row["valuation"]
        })
        
    return properties

@app.get("/api/search")
def search_properties(
    query: Optional[str] = None,
    type: Optional[str] = None,
    minPrice: Optional[float] = None,
    maxPrice: Optional[float] = None
):
    conn = get_connection()
    cursor = conn.cursor()
    
    sql = "SELECT * FROM properties WHERE 1=1"
    params = []
    
    if query:
        sql += " AND (name LIKE ? OR address LIKE ?)"
        params.extend([f"%{query}%", f"%{query}%"])
    
    if type:
        sql += " AND property_type = ?"
        params.append(type)
        
    if minPrice is not None:
        sql += " AND valuation >= ?"
        params.append(minPrice)
        
    if maxPrice is not None:
        sql += " AND valuation <= ?"
        params.append(maxPrice)
        
    cursor.execute(sql, params)
    rows = cursor.fetchall()
    conn.close()
    
    results = []
    for row in rows:
        results.append({
            "id": row["id"],
            "name": row["name"],
            "address": row["address"],
            "mainImage": row["main_image"],
            "floorPlan": row["floor_plan"],
            "propertyType": row["property_type"],
            "valuation": row["valuation"]
        })
        
    return results


@app.get("/api/properties/compare")
def compare_properties(id1: int, id2: int):
    def get_details(pid):
        p_data, p_analysis = get_property_by_id(pid)
        if not p_data: return None
        a_dict = dict(p_analysis) if p_analysis else None
        if a_dict and a_dict.get("features") and isinstance(a_dict["features"], str):
            a_dict["features"] = [f.strip() for f in a_dict["features"].split(",")]
        return {
            "id": p_data["id"],
            "name": p_data["name"],
            "address": p_data["address"],
            "mainImage": p_data["main_image"],
            "floorPlan": p_data["floor_plan"],
            "description": p_data["description"],
            "valuation": p_data["valuation"],
            "valuation_reasoning": p_data["valuation_reasoning"],
            "analysis": a_dict
        }
    
    prop1 = get_details(id1)
    prop2 = get_details(id2)
    
    if not prop1 or not prop2:
        raise HTTPException(status_code=404, detail="One or both properties not found")

    # Generate AI Verdict
    verdict = "Comparison complete. Analyze metrics below."
    try:
        prompt = f"""
        Compare these two real estate properties and provide a "Final Verdict" on which one is a better investment or choice.
        
        Property 1: {prop1['name']} at {prop1['address']}. 
        Value: {prop1['valuation']}. Style: {prop1.get('analysis', {}).get('style')}.
        
        Property 2: {prop2['name']} at {prop2['address']}. 
        Value: {prop2['valuation']}. Style: {prop2.get('analysis', {}).get('style')}.
        
        Provide a 2-3 sentence professional recommendation. Be decisive but professional.
        Format: Start with "REACTION: [Property Name] is the stronger choice because..."
        """
        response = llm.invoke(prompt)
        verdict = response.content
        if isinstance(verdict, list):
            verdict = "".join([c.get("text", "") if isinstance(c, dict) else str(c) for c in verdict])
    except Exception as e:
        print(f"Verdict Error: {e}")
        
    return {
        "properties": [prop1, prop2],
        "verdict": verdict
    }

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



@retry_with_backoff(retries=3, initial_delay=2.0)
async def analyze_property_with_vision(image_paths: List[str]):
    """
    Uses Vision LLM to extract features from property images.
    """
    # Simply using the first image for analysis for now
    if not image_paths:
        return None, "No image paths provided"
    
    image_path = image_paths[0]
    if not os.path.exists(image_path):
        return None, f"Image file not found at {image_path}"

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
            return json.loads(json_match.group()), None
        return None, "Failed to parse JSON from LLM response"
    except Exception as e:
        print(f"Vision Analysis Error: {e}")
        return None, str(e)

@retry_with_backoff(retries=3, initial_delay=2.0)
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

@retry_with_backoff(retries=3, initial_delay=2.0)
async def estimate_property_value(property_metadata: dict, analysis_data: dict):
    """
    Uses Text LLM to estimate property value and provide reasoning.
    """
    prompt_template = PromptTemplate.from_template(
        """
        You are an expert real estate appraiser with deep knowledge of global property markets. 
        Based on the following property details, provide an estimated market valuation in USD and a detailed professional reasoning.
        
        Property Details:
        Name: {name}
        Address: {address}
        Room Count: {room_count}
        Condition: {condition}
        Style: {style}
        Key Features: {features}
        
        Format your response STRICTLY as JSON with these keys:
        - valuation: (a number representing the value in USD)
        - reasoning: (2-3 sentences explaining why this value was chosen based on style, condition, and location)
        
        Valuation should be a realistic estimate. 
        If the location seems high-end (e.g., Malibu, New York, London), reflect that in the price.
        """
    )
    
    chain = prompt_template | llm
    
    features = analysis_data.get("features", [])
    features_str = ", ".join(features) if isinstance(features, list) else str(features)
    
    response = chain.invoke({
        "name": property_metadata["name"],
        "address": property_metadata["address"],
        "room_count": analysis_data.get("room_count", "N/A"),
        "condition": analysis_data.get("condition", "Good"),
        "style": analysis_data.get("style", "Modern"),
        "features": features_str
    })
    
    content = response.content
    if isinstance(content, list):
        content = "".join([c.get("text", "") if isinstance(c, dict) else str(c) for c in content])
    
    # Extract JSON from response
    import json
    import re
    
    json_match = re.search(r'\{.*\}', content, re.DOTALL)
    if json_match:
        try:
            data = json.loads(json_match.group(0))
            return data
        except:
            return {"valuation": 0, "reasoning": "Could not parse valuation data."}
    
    return {"valuation": 0, "reasoning": "No valuation generated."}

@app.post("/api/properties/{property_id}/valuation")
async def get_valuation(property_id: int):
    # 1. Get property and analysis
    property_data, analysis_db = get_property_by_id(property_id)
    if not property_data:
        raise HTTPException(status_code=404, detail="Property not found")
        
    if not analysis_db:
        raise HTTPException(status_code=400, detail="AI Analysis required before valuation. Please run re-analyze first.")
        
    # Convert DB row to dict for easier access
    analysis_data = {
        "room_count": analysis_db["room_count"],
        "condition": analysis_db["condition"],
        "style": analysis_db["style"],
        "features": analysis_db["features"]
    }
    
    # 2. Get valuation from LLM
    valuation_results = await estimate_property_value(dict(property_data), analysis_data)
    
    # 3. Update database
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE properties SET valuation = ?, valuation_reasoning = ? WHERE id = ?",
        (valuation_results.get("valuation"), valuation_results.get("reasoning"), property_id)
    )
    conn.commit()
    conn.close()
    
    return valuation_results

@app.delete("/api/properties/{property_id}")
async def delete_property(property_id: int):
    # 1. Get property details to find image paths
    property_data, _ = get_property_by_id(property_id)
    if not property_data:
        raise HTTPException(status_code=404, detail="Property not found")
    
    # 2. Delete files from filesystem
    def try_delete_file(path):
        if path and os.path.exists(path):
            try:
                os.remove(path)
            except Exception as e:
                print(f"Error deleting file {path}: {e}")

    try_delete_file(property_data["main_image"])
    try_delete_file(property_data["floor_plan"])
    
    # 3. Delete from database
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM property_analysis WHERE property_id = ?", (property_id,))
        cursor.execute("DELETE FROM properties WHERE id = ?", (property_id,))
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        conn.close()
    
    return {"message": "Property deleted successfully"}

@app.patch("/api/properties/{property_id}")
async def update_property(property_id: int, name: str = Form(None), address: str = Form(None), propertyType: str = Form(None)):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM properties WHERE id = ?", (property_id,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Property not found")
    
    updates = []
    params = []
    if name:
        updates.append("name = ?")
        params.append(name)
    if address:
        updates.append("address = ?")
        params.append(address)
    if propertyType:
        updates.append("property_type = ?")
        params.append(propertyType)
        
    if not updates:
        conn.close()
        return {"message": "No updates provided"}
        
    sql = f"UPDATE properties SET {', '.join(updates)} WHERE id = ?"
    params.append(property_id)
    cursor.execute(sql, params)
    conn.commit()
    conn.close()
    return {"message": "Property updated successfully"}
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
        
    analysis_results, error_msg = await analyze_property_with_vision(image_paths)
    if not analysis_results:
        raise HTTPException(status_code=500, detail=f"Failed to analyze images: {error_msg}")
    
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







def get_all_properties():
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
            "thumbnail": row["main_image"],  # using main image
            "valuation": "Not calculated yet"
        })

    return properties




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
    propertyType: str = Form(...),
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
        INSERT INTO properties (name, address, main_image, floor_plan, property_type)
        VALUES (?, ?, ?, ?, ?)
        """,
        (name, address, main_image_path, floor_plan_path, propertyType)
    )

    conn.commit()
    conn.close()

    return {
        "message": "Property uploaded successfully"
    }


@app.get("/api/properties")
def fetch_properties():
    properties = get_all_properties()
    return properties
