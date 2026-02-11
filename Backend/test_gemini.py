import os
import base64
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

def test_vision():
    print(f"Testing with API Key: {GEMINI_API_KEY[:5]}...{GEMINI_API_KEY[-4:]}")
    vision_llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash-lite", google_api_key=GEMINI_API_KEY)
    
    image_path = "uploads/images5.jpg"
    if not os.path.exists(image_path):
        print(f"Error: {image_path} not found")
        return

    with open(image_path, "rb") as image_file:
        base64_image = base64.b64encode(image_file.read()).decode('utf-8')
    
    message = HumanMessage(
        content=[
            {"type": "text", "text": "What is in this image?"},
            {
                "type": "image_url",
                "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"},
            },
        ]
    )
    
    try:
        response = vision_llm.invoke([message])
        print("Response received:")
        print(response.content)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_vision()
