import sqlite3

DATABASE_NAME = "properties.db"

def get_connection():
    conn = sqlite3.connect(DATABASE_NAME)
    conn.row_factory = sqlite3.Row
    return conn


def create_tables():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS properties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        main_image TEXT NOT NULL,
        floor_plan TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS property_analysis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_id INTEGER,
    analysis TEXT,
    FOREIGN KEY(property_id) REFERENCES properties(id)
    )
    """)


    conn.commit()
    conn.close()



