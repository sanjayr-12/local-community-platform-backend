import psycopg2
import psycopg2.extras
import os
from dotenv import load_dotenv
from contextlib import contextmanager

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "")


def get_connection():
    """Return a new psycopg2 connection."""
    return psycopg2.connect(DATABASE_URL)


@contextmanager
def get_cursor():
    """Context manager that yields a dict cursor and auto-commits/rolls back."""
    conn = get_connection()
    try:
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        yield cursor
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()
