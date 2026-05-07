import sqlite3
import os
import shutil

# On Vercel, the filesystem is read-only. We use /tmp for the database to allow writes.
if os.environ.get("VERCEL"):
    DATABASE_NAME = "/tmp/properties.db"
    # Copy the initial database if it exists in the app directory and not yet in /tmp
    if not os.path.exists(DATABASE_NAME) and os.path.exists("properties.db"):
        try:
            shutil.copy("properties.db", DATABASE_NAME)
        except Exception as e:
            print(f"Error copying database: {e}")
else:
    DATABASE_NAME = "properties.db"


def get_connection():
    conn = sqlite3.connect(DATABASE_NAME)
    conn.row_factory = sqlite3.Row
    return conn


def create_tables():
    conn = get_connection()
    cursor = conn.cursor()

    # Properties table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS properties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        main_image TEXT NOT NULL,
        floor_plan TEXT,
        description TEXT,
        property_type TEXT,
        valuation REAL,
        valuation_reasoning TEXT
    )
    """)

    # Property Analysis table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS property_analysis (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        property_id INTEGER NOT NULL,
        room_count INTEGER,
        condition TEXT,
        style TEXT,
        features TEXT,
        FOREIGN KEY (property_id) REFERENCES properties (id)
    )
    """)

    conn.commit()
    conn.close()

