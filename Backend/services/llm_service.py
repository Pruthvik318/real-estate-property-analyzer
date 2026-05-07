import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    google_api_key=os.getenv("GEMINI_API_KEY")
)


def analyze_property_images(main_image_path, floor_plan_path=None):

    prompt = """
    Analyze property images and extract:

    - Estimated number of rooms
    - Property features (balcony, fireplace, etc.)
    - Property condition
    - Property style/type
    """

    messages = [HumanMessage(content=prompt)]

    result = llm.invoke(messages)

    return result.content
