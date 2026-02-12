
import asyncio
import random
import time
from functools import wraps

def retry_with_backoff(retries=3, initial_delay=1.0, backoff_factor=2.0):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            delay = initial_delay
            last_exception = None
            
            for attempt in range(retries + 1):
                try:
                    return await func(*args, **kwargs)
                except Exception as e:
                    last_exception = e
                    if "RESOURCE_EXHAUSTED" in str(e) or "429" in str(e):
                        if attempt < retries:
                            sleep_time = delay + random.uniform(0, 0.5)
                            print(f"Rate limit hit (429). Retrying in {sleep_time:.2f}s... (Attempt {attempt+1}/{retries})")
                            await asyncio.sleep(sleep_time)
                            delay *= backoff_factor
                            continue
                    raise e
            raise last_exception
        return wrapper
    return decorator
