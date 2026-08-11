import time
import threading
from langchain_core.messages import HumanMessage, AIMessage


class MemoryService:

    def __init__(self, llm):
        self.llm = llm
        self.sessions = {}

       
        self.lock = threading.RLock()

  
        self.MAX_HISTORY_MESSAGES = 8
        self.MAX_SUMMARY_CHARS = 800

 
        self.SESSION_TIMEOUT = 1800

    # =========================
    # 🧠 SESSION MANAGEMENT (THREAD SAFE)
    # =========================
    def get_or_create_session(self, user_id):
        with self.lock:
            if user_id not in self.sessions:
                self.sessions[user_id] = {
                    "chat_history": [],
                    "memory_summary": "",
                    "created_at": time.time(),
                    "last_active": time.time(),
                    "records": {},
                    "last_intent": None
                }
            return self.sessions[user_id]

    # =========================
    # 📝 SAFE WRITE METHODS (New Helper Functions)
    # =========================
    def add_message(self, user_id, message):
        with self.lock:
            if user_id in self.sessions:
                self.sessions[user_id]["chat_history"].append(message)
                self.sessions[user_id]["last_active"] = time.time()

    def set_session_value(self, user_id, key, value):
        with self.lock:
            if user_id in self.sessions:
                self.sessions[user_id][key] = value
                self.sessions[user_id]["last_active"] = time.time()

    # =========================
    # ⏱ UPDATE LAST ACTIVE
    # =========================
    def update_last_active(self, session):
        with self.lock:
            session["last_active"] = time.time()

    # =========================
    # 🧠 MEMORY UPDATE (STABLE + LOCK PROTECTED)
    # =========================
    def update_memory(self, session):
        with self.lock:
    
            if len(session["chat_history"]) >= self.MAX_HISTORY_MESSAGES + 2:

                to_summarize = session["chat_history"][:-self.MAX_HISTORY_MESSAGES]
                session["chat_history"] = session["chat_history"][-self.MAX_HISTORY_MESSAGES:]

                old_summary = session.get("memory_summary", "")

                new_raw_text = "\n".join([
                    f"{m.type}: {m.content}" for m in to_summarize
                ])

               
                prompt = f"""
أنت نظام ذاكرة لمساعد جامعي.

المطلوب:
- تلخيص فقط المعلومات المهمة جداً
- لا تدمج مواضيع مختلفة
- لا تضف أي استنتاجات جديدة
- حافظ على دقة المعلومات فقط

الملخص السابق:
{old_summary}

المحادثة الجديدة:
{new_raw_text}

أعطني 5 نقاط فقط مختصرة جداً بدون تكرار.
"""

                try:
                    new_summary = self.llm.invoke(prompt).content
                    session["memory_summary"] = new_summary[:self.MAX_SUMMARY_CHARS]
                except Exception:
                    pass

    # =========================
    # 🧠 SUMMARIZE UTILITY
    # =========================
    def summarize_history(self, chat_history):
        if not chat_history:
            return ""

        text = "\n".join([
            f"{msg.type}: {msg.content}"
            for msg in chat_history
        ])

        prompt = f"""
لخص المحادثة التالية في 5 نقاط قصيرة فقط:

{text}

الملخص:
"""
        try:
            return self.llm.invoke(prompt).content[:self.MAX_SUMMARY_CHARS]
        except Exception:
            return ""

    # =========================
    # 🧹 CLEANUP (SAFE + THREAD LOCK)
    # =========================
    def cleanup_sessions(self):
        with self.lock:
            now = time.time()
            to_delete = [
                user_id
                for user_id, session in self.sessions.items()
                if now - session["last_active"] > self.SESSION_TIMEOUT
            ]

            for user_id in to_delete:
                del self.sessions[user_id]

    # =========================
    # ⏱ TIME UTILITY
    # =========================
    def get_time(self):
        return time.time()

    # =========================
    # 🔄 FORMAT FOR LLM
    # =========================
    def format_chat_history(self, chat_history):
        return [
            {
                "role": "user" if isinstance(m, HumanMessage) else "assistant",
                "content": m.content
            }
            for m in chat_history
        ]