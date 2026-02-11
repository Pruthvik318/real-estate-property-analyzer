import sqlite3

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

