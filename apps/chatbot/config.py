import os
from dotenv import load_dotenv

# =========================
# 🔑 LOAD ENV
# =========================
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# =========================
# 🗄️ PROJECT ROOT (FIXED)
# =========================
# بما أن الملف في C:\Users\HP\Desktop\graduation project\config.py
# فإن dirname واحدة ستعطيك مسار المجلد الرئيسي للمشروع مباشرة
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# =========================
# 🤖 MODEL SETTINGS
# =========================
EMBEDDING_MODEL = "intfloat/multilingual-e5-large"
LLM_MODEL_NAME = "llama-3.3-70b-versatile"
INTENT_LLM_MODEL_NAME = "llama-3.1-8b-instant"

# =========================
# ⚙️ SYSTEM SETTINGS
# =========================
MAX_HISTORY_MESSAGES = 5
SESSION_TIMEOUT = 1800
DEFAULT_GPA = 2.5

# =========================
# 📊 GRADES
# =========================
FAILED_GRADES = ["F", "(F)", "ABS", "FW", "U"]
INCOMPLETE_GRADES = ["I"]

# =========================
# 🧠 APP SETTINGS
# =========================
APP_NAME = "UNIQ"
DEBUG = True

# =========================
# 🗄️ DATA PATHS
# =========================
DATA_DIR = os.path.join(BASE_DIR, "data")
CHROMA_DIR = os.path.join(DATA_DIR, "chroma_laiha_v2")
PDF_PATH = os.path.join(DATA_DIR, "Department")

# مراجعة المسارات في الـ Terminal عند التشغيل للتأكد
if DEBUG:
    print(f"\n--- UNIQ PATH CHECK ---")
    print(f"✅ Project Root: {BASE_DIR}")
    print(f"✅ PDF Path: {PDF_PATH}")
    print(f"✅ Chroma Path: {CHROMA_DIR}")
    print(f"-----------------------\n")