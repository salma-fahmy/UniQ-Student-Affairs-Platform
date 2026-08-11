import time
import threading
from collections import defaultdict


class RateLimiter:
    """
    Simple but production-safe rate limiter for LLM + API protection.

    Prevents:
    - Groq/OpenAI 429 errors
    - request spikes from multiple users
    - accidental spam clicks from Streamlit
    """

    def __init__(self):
        # stores timestamps per user
        self.requests = defaultdict(list)

        # thread safety (important for FastAPI)
        self.lock = threading.Lock()

    # =========================
    # 🔥 CORE RATE LIMIT LOGIC
    # =========================
    def allow_request(self, user_id: str, limit: int = 5, window: int = 10) -> tuple[bool, int]:
        """
        Check if user is allowed to make a request.

        Args:
            user_id: unique user/session id
            limit: max requests allowed (raised from 2 → 5)
            window: time window in seconds

        Returns:
            (True, 0)         → allowed
            (False, wait_sec) → blocked, with seconds remaining
        """

        with self.lock:
            now = time.time()

            # remove old timestamps outside window
            self.requests[user_id] = [
                t for t in self.requests[user_id]
                if now - t < window
            ]

            # check limit
            if len(self.requests[user_id]) >= limit:
                # calculate remaining wait time from oldest request
                oldest = self.requests[user_id][0]
                wait_seconds = int(window - (now - oldest)) + 1
                return False, wait_seconds

            # add current request timestamp
            self.requests[user_id].append(now)
            return True, 0

    # =========================
    # 🧹 OPTIONAL CLEANUP
    # =========================
    def cleanup(self, max_age: int = 3600):
        """
        Clean old users from memory (prevents memory leak).
        """
        with self.lock:
            now = time.time()

            for user_id in list(self.requests.keys()):
                self.requests[user_id] = [
                    t for t in self.requests[user_id]
                    if now - t < max_age
                ]

                if not self.requests[user_id]:
                    del self.requests[user_id]