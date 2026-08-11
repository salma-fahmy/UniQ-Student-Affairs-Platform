import streamlit as st
import requests
import os
import uuid
import re

# =========================
# ⚙️ CONFIGURATION
# =========================
st.set_page_config(
    page_title="UNIQ AI Assistant",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ✅ كل الـ requests بتعدي من الـ Node — مش مباشرة للـ chatbot
NODE_URL = os.getenv("AUTH_BACKEND_URL", "http://api:3000")

CHAT_URL   = f"{NODE_URL}/api/v1/chatbot/chat"
CALC_URL   = f"{NODE_URL}/api/v1/chatbot/calculate-gpa"
PLAN_URL   = f"{NODE_URL}/api/v1/chatbot/plan-gpa"
LOGIN_URL  = f"{NODE_URL}/api/v1/auth/login"
LOGOUT_URL = f"{NODE_URL}/api/v1/auth/logout"

# =========================
# 🎨 GLOBAL CSS
# =========================
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --bg:           #0a0f1e;
  --bg2:          #0f1629;
  --bg3:          #141c35;
  --surface:      #1a2340;
  --surface2:     #1f2a4a;
  --border:       rgba(99,130,255,0.15);
  --border2:      rgba(99,130,255,0.28);
  --accent:       #4f7dff;
  --accent2:      #7b9fff;
  --accent-glow:  rgba(79,125,255,0.18);
  --text:         #e8edf8;
  --text2:        #8a96b8;
  --text3:        #5a6585;
  --success:      #22c55e;
  --danger:       #ef4444;
  --radius:       14px;
  --radius-sm:    8px;
  --font:         'Cairo', sans-serif;
  --mono:         'JetBrains Mono', monospace;
}

#MainMenu, footer, header { visibility: hidden; }
.stDeployButton { display: none; }

html, body, [class*="css"] {
  font-family: var(--font) !important;
  background-color: var(--bg) !important;
  color: var(--text) !important;
}

.block-container {
  padding-top: 0 !important;
  padding-bottom: 1rem !important;
  max-width: 100% !important;
}

/* ── SIDEBAR ── */
[data-testid="stSidebar"] {
  background-color: var(--bg2) !important;
  border-right: 1px solid var(--border) !important;
}
[data-testid="stSidebar"] > div:first-child { padding: 24px 16px !important; }
[data-testid="stSidebar"] .stMarkdown p,
[data-testid="stSidebar"] .stMarkdown div,
[data-testid="stSidebar"] label,
[data-testid="stSidebar"] small { color: var(--text) !important; font-family: var(--font) !important; }

[data-testid="stSidebar"] .stButton > button {
  width: 100% !important;
  background: transparent !important;
  border: 1px solid var(--border2) !important;
  color: var(--text2) !important;
  font-family: var(--font) !important;
  font-size: 13px !important;
  padding: 9px !important;
  border-radius: var(--radius-sm) !important;
  transition: all .2s !important;
}
[data-testid="stSidebar"] .stButton > button:hover {
  background: rgba(239,68,68,0.08) !important;
  border-color: var(--danger) !important;
  color: var(--danger) !important;
}

/* ── LOGIN SCREEN ── */
.login-wrapper {
  min-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
}
.login-card {
  background: var(--surface);
  border: 1px solid var(--border2);
  border-radius: 20px;
  padding: 48px 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 0 60px rgba(79,125,255,0.08);
  text-align: center;
}
.login-logo { font-size: 48px; margin-bottom: 12px; }
.login-title { font-size: 26px; font-weight: 700; color: var(--text); margin-bottom: 6px; }
.login-title span { color: var(--accent2); }
.login-subtitle { font-size: 13px; color: var(--text3); margin-bottom: 32px; }
.login-divider { border: none; border-top: 1px solid var(--border); margin: 24px 0; }

.login-card .stTextInput input {
  background: var(--bg2) !important;
  border: 1px solid var(--border2) !important;
  color: var(--text) !important;
  font-family: var(--font) !important;
  font-size: 14px !important;
  border-radius: var(--radius-sm) !important;
  direction: rtl !important;
}
.login-card .stTextInput input:focus {
  border-color: var(--accent) !important;
  box-shadow: 0 0 0 2px rgba(79,125,255,0.15) !important;
}
.login-card .stTextInput label {
  color: var(--text2) !important;
  font-family: var(--font) !important;
  font-size: 13px !important;
  direction: rtl !important;
}
.login-card .stButton > button {
  width: 100% !important;
  font-family: var(--font) !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  padding: 11px !important;
  border-radius: var(--radius-sm) !important;
  transition: all .2s !important;
}
.login-card .stButton > button[kind="primary"] {
  background: linear-gradient(135deg, var(--accent), #6b5ce7) !important;
  border: none !important;
  color: #fff !important;
}
.login-card .stButton > button[kind="primary"]:hover {
  opacity: .88 !important;
  transform: translateY(-1px) !important;
}
.login-card .stButton > button[kind="secondary"] {
  background: transparent !important;
  border: 1px solid var(--border2) !important;
  color: var(--text2) !important;
}
.login-card .stButton > button[kind="secondary"]:hover {
  border-color: var(--accent) !important;
  color: var(--text) !important;
}

/* ── CHAT HEADER ── */
.uniq-header {
  text-align: center;
  padding: 20px 32px 16px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 0;
}
.uniq-header h1 { font-size: 22px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
.uniq-header p  { font-size: 13px; color: var(--text3); margin: 0; }

/* ── MESSAGES ── */
.msg-user-wrap {
  display: flex; justify-content: flex-end;
  gap: 10px; margin-bottom: 16px;
  animation: fadeUp .25s ease;
}
.msg-bot-wrap {
  display: flex; justify-content: flex-start;
  gap: 10px; margin-bottom: 16px;
  animation: fadeUp .25s ease;
}
@keyframes fadeUp {
  from { opacity:0; transform:translateY(10px); }
  to   { opacity:1; transform:translateY(0);    }
}
.avatar-bot {
  width: 34px; height: 34px; border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), #8b5cf6);
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; flex-shrink: 0;
}
.avatar-user {
  width: 34px; height: 34px; border-radius: 50%;
  background: var(--surface2); border: 1px solid var(--border2);
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; flex-shrink: 0;
}
.bubble-user {
  max-width: 72%; padding: 12px 16px;
  border-radius: var(--radius); border-top-left-radius: 4px;
  background: linear-gradient(135deg, #1e3a8a, #1d3070);
  border: 1px solid rgba(79,125,255,0.3);
  font-size: 14px; line-height: 1.8; color: var(--text); direction: rtl;
}
.bubble-bot {
  max-width: 78%; padding: 12px 16px;
  border-radius: var(--radius); border-top-right-radius: 4px;
  background: var(--surface); border: 1px solid var(--border);
  font-size: 14px; line-height: 1.8; direction: rtl; color: var(--text);
}
.bubble-bot h1,.bubble-bot h2,.bubble-bot h3 { color: var(--accent2); margin: 10px 0 6px; font-size: 14px; }
.bubble-bot ul,.bubble-bot ol { padding-right: 18px; margin: 6px 0; }
.bubble-bot li { margin-bottom: 4px; }
.bubble-bot code {
  background: var(--bg); color: var(--accent2);
  padding: 1px 6px; border-radius: 4px;
  font-family: var(--mono); font-size: 12px;
}
.bubble-bot strong { color: var(--accent2); }

/* ── SUGGESTIONS ── */
.sug-title { font-size: 12px; color: var(--text3); margin-bottom: 10px; margin-top: 8px; }
.sug-btn-div button {
  width: 100% !important;
  background: var(--surface) !important;
  border: 1px solid var(--border) !important;
  color: var(--text2) !important;
  font-family: var(--font) !important;
  font-size: 13px !important;
  padding: 10px 14px !important;
  border-radius: var(--radius-sm) !important;
  text-align: right !important;
  line-height: 1.5 !important;
  transition: all .2s !important;
  min-height: 56px !important;
}
.sug-btn-div button:hover {
  border-color: var(--accent) !important;
  color: var(--text) !important;
  background: var(--accent-glow) !important;
  transform: translateY(-1px) !important;
}

/* ── CHAT INPUT ── */
[data-testid="stChatInput"] {
  background-color: var(--surface) !important;
  border: 1px solid var(--border) !important;
  border-radius: var(--radius) !important;
  padding: 4px !important;
}
[data-testid="stChatInput"] textarea {
  background-color: var(--bg2) !important;
  color: var(--text) !important;
  -webkit-text-fill-color: var(--text) !important;
  caret-color: var(--accent) !important;
  font-family: var(--font) !important;
  font-size: 15px !important;
  line-height: 1.6 !important;
  direction: rtl !important;
  border-radius: var(--radius-sm) !important;
}
[data-testid="stChatInput"] textarea:focus {
  color: var(--text) !important;
  -webkit-text-fill-color: var(--text) !important;
  background-color: var(--bg3) !important;
}
[data-testid="stChatInput"] textarea::placeholder {
  color: var(--text3) !important;
  -webkit-text-fill-color: var(--text3) !important;
  opacity: 0.8 !important;
}
[data-testid="stChatInput"] div { background-color: transparent !important; color: var(--text) !important; }
[data-testid="stChatInput"] section { background-color: transparent !important; }

/* ── PANELS ── */
.stExpander {
  background: var(--bg2) !important;
  border: 1px solid var(--border2) !important;
  border-radius: var(--radius) !important;
}
.stExpander summary {
  background: var(--surface) !important;
  color: var(--text) !important;
  font-family: var(--font) !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  border-radius: var(--radius) !important;
}
.stExpander summary:hover { background: var(--surface2) !important; }
.stExpander [data-testid="stExpanderDetails"] { background: var(--bg2) !important; padding: 16px !important; }
.stExpander label, .stExpander .stSelectbox label,
.stExpander .stTextInput label, .stExpander .stNumberInput label {
  color: var(--text3) !important; font-size: 12px !important; font-family: var(--font) !important;
}
.stExpander .stTextInput input,
.stExpander .stNumberInput input,
.stExpander .stSelectbox > div > div {
  background: var(--surface2) !important;
  border: 1px solid var(--border) !important;
  color: var(--text) !important;
  font-family: var(--font) !important;
  font-size: 13px !important;
  border-radius: var(--radius-sm) !important;
}
.stExpander .stTextInput input:focus,
.stExpander .stNumberInput input:focus,
.stExpander .stSelectbox > div > div:focus-within {
  border-color: var(--accent) !important; box-shadow: none !important;
}
.stExpander .stButton > button[kind="primary"],
.stExpander .stFormSubmitButton > button {
  background: var(--accent) !important; border: none !important;
  color: #fff !important; font-family: var(--font) !important;
  font-size: 13px !important; font-weight: 600 !important;
  padding: 9px 18px !important; border-radius: var(--radius-sm) !important;
}
.stExpander .stButton > button[kind="secondary"] {
  background: transparent !important;
  border: 1px solid var(--border2) !important;
  color: var(--text2) !important;
  font-family: var(--font) !important;
  font-size: 13px !important; font-weight: 600 !important;
  padding: 9px 18px !important; border-radius: var(--radius-sm) !important;
}

.stAlert { border-radius: var(--radius-sm) !important; font-family: var(--font) !important; font-size: 13px !important; }
[data-testid="stAlertContentInfo"]    { background: var(--accent-glow) !important; border: 1px solid rgba(79,125,255,0.25) !important; color: var(--accent2) !important; }
[data-testid="stAlertContentSuccess"] { background: rgba(34,197,94,0.1) !important; border: 1px solid rgba(34,197,94,0.3) !important; color: var(--success) !important; }
[data-testid="stAlertContentError"]   { background: rgba(239,68,68,0.08) !important; border: 1px solid rgba(239,68,68,0.25) !important; color: var(--danger) !important; }

.result-card { background: var(--surface); border: 1px solid var(--border2); border-radius: var(--radius-sm); padding: 16px; margin-top: 12px; text-align: center; }
.result-gpa  { font-size: 36px; font-weight: 700; color: var(--accent2); margin-bottom: 4px; }
.result-label { font-size: 12px; color: var(--text3); margin-bottom: 12px; }
.grade-item  { display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: var(--bg); border-radius: var(--radius-sm); font-size: 13px; margin-bottom: 6px; direction: rtl; }
.grade-item-label { color: var(--text2); }
.grade-badge { background: var(--accent-glow); color: var(--accent2); border: 1px solid rgba(79,125,255,0.25); padding: 2px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }

.user-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px; margin: 8px 0; }
.user-card-label { font-size: 11px; color: var(--text3); margin-bottom: 6px; }
.user-id-val { font-family: var(--mono); font-size: 10px; color: var(--accent2); word-break: break-all; line-height: 1.6; }

.sidebar-logo { display: flex; align-items: center; gap: 10px; padding: 4px 0 16px; border-bottom: 1px solid var(--border); margin-bottom: 4px; }
.logo-icon { width: 36px; height: 36px; background: linear-gradient(135deg, var(--accent), #8b5cf6); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
.logo-text { font-size: 20px; font-weight: 700; color: var(--text); }
.logo-text span { color: var(--accent2); }
.sidebar-section-label { font-size: 11px; font-weight: 600; color: var(--text3); text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 6px; margin-top: 4px; }

.typing-indicator { display: flex; gap: 5px; align-items: center; padding: 6px 2px; }
.typing-indicator span { width: 7px; height: 7px; border-radius: 50%; background: var(--text3); animation: blink 1.2s infinite; display: inline-block; }
.typing-indicator span:nth-child(2) { animation-delay: .2s; }
.typing-indicator span:nth-child(3) { animation-delay: .4s; }
@keyframes blink { 0%,80%,100% { opacity:.3; transform:scale(1); } 40% { opacity:1; transform:scale(1.25); } }

input[type=number]::-webkit-outer-spin-button,
input[type=number]::-webkit-inner-spin-button { -webkit-appearance:none; }
input[type=number] { -moz-appearance:textfield; }
hr { border-color: var(--border) !important; }
</style>
""", unsafe_allow_html=True)

# =========================
# 💡 SUGGESTIONS
# =========================
SUGGESTIONS = [
    "اسجل Convex Optimization ولا Bayesian Statistics؟",
    "عايز احسب الـ GPA",
    "عايز أوصل GPA 3.5 وأنا دلوقتي 2",
    "الـ GPA عبارة عن ايه؟",
    "ايه ال prerequisite لـ Data Structure؟",
    "رشحلي مواد سهلة الترم الجاي",
]

# =========================
# 🔧 SESSION STATE INIT
# =========================
defaults = {
    "logged_in":       False,
    "user_id":         None,
    "user_name":       None,
    "jwt_token":       None,
    "refresh_token":   None,
    "messages":        [],
    "gpa_rows":        1,
    "current_intent":  None,
    "last_bot_answer": "",
    "pending_prompt":  None,
    "calc_result":     None,
    "plan_result":     None,
    "invalid_grades":  [],
}
for k, v in defaults.items():
    if k not in st.session_state:
        st.session_state[k] = v


# =========================
# 🚪 LOGOUT HELPER
# =========================
def _do_logout():
    try:
        headers = {}
        if st.session_state.jwt_token:
            headers["Authorization"] = f"Bearer {st.session_state.jwt_token}"
        requests.post(
            LOGOUT_URL,
            json={"refreshToken": st.session_state.get("refresh_token", "")},
            headers=headers,
            timeout=5
        )
    except Exception:
        pass
    for k, v in defaults.items():
        st.session_state[k] = v
    st.rerun()


# =========================
# 🔐 LOGIN SCREEN
# =========================
def show_login():
    st.markdown("""
    <style>
    [data-testid="stSidebar"] { display: none !important; }
    .block-container { padding-top: 2rem !important; }
    </style>
    """, unsafe_allow_html=True)

    _, center, _ = st.columns([1, 1.2, 1])

    with center:
        st.markdown("""
        <div class="login-card">
            <div class="login-logo">🤖</div>
            <div class="login-title">UNIQ <span>AI</span></div>
            <div class="login-subtitle">مساعدك الأكاديمي الذكي</div>
        </div>
        """, unsafe_allow_html=True)

        st.markdown("<div style='height:16px'></div>", unsafe_allow_html=True)

        user_id_input  = st.text_input("🆔 رقم الطالب",  placeholder="مثال: 22010025", key="login_user_id")
        password_input = st.text_input("🔑 الباسورد",     type="password", placeholder="أدخل الباسورد", key="login_password")

        st.markdown("<div style='height:8px'></div>", unsafe_allow_html=True)

        col_a, col_b = st.columns(2)

        with col_a:
            if st.button("🚪 دخول كضيف", use_container_width=True):
                st.session_state.logged_in = True
                st.session_state.user_id   = f"guest_{uuid.uuid4().hex[:8]}"
                st.session_state.user_name = "ضيف"
                st.session_state.messages  = []
                st.rerun()

        with col_b:
            if st.button("✅ تسجيل الدخول", type="primary", use_container_width=True):
                if not user_id_input or not password_input:
                    st.warning("⚠️ أدخل رقم الطالب والباسورد.")
                else:
                    with st.spinner("جاري التحقق..."):
                        try:
                            resp = requests.post(
                                LOGIN_URL,
                                json={"userId": user_id_input, "password": password_input},
                                timeout=15
                            )
                            if resp.status_code == 200:
                                data = resp.json()
                                if data.get("code") == "success":
                                    st.session_state.logged_in     = True
                                    st.session_state.user_id       = user_id_input
                                    st.session_state.user_name     = user_id_input
                                    st.session_state.jwt_token     = data.get("data", {}).get("accessToken")
                                    st.session_state.refresh_token = data.get("data", {}).get("refreshToken", "")
                                    st.session_state.messages      = []
                                    st.rerun()
                                else:
                                    st.error(f"❌ {data.get('message', 'خطأ في تسجيل الدخول.')}")
                            else:
                                st.error(f"❌ Server Error: {resp.status_code}")
                        except requests.exceptions.ConnectionError:
                            st.error("❌ تعذر الاتصال بالـ server.")
                        except Exception as e:
                            st.error(f"❌ خطأ: {e}")

        st.markdown("""
        <hr class="login-divider">
        <div style="font-size:12px; color:var(--text3); text-align:center; line-height:1.7;">
            💡 الضيف يقدر يسأل عن اللائحة الأكاديمية فقط.<br>
            الطلاب المسجلين يقدروا يحسبوا الـ GPA ويشوفوا التوصيات.
        </div>
        """, unsafe_allow_html=True)


# =========================
# 💬 CHAT SCREEN
# =========================
def show_chat():

    is_guest = (st.session_state.user_name == "ضيف")

    with st.sidebar:
        st.markdown("""
        <div class="sidebar-logo">
            <div class="logo-icon">🤖</div>
            <div class="logo-text">UNIQ <span>AI</span></div>
        </div>
        """, unsafe_allow_html=True)

        st.markdown('<div class="sidebar-section-label">الحساب</div>', unsafe_allow_html=True)

        if is_guest:
            st.info("👤 أنت تتصفح كـ **ضيف**")
        else:
            st.markdown(f"""
            <div class="user-card">
                <div class="user-card-label">👋 مرحباً</div>
                <div style="font-size:15px;font-weight:600;color:var(--text);margin-bottom:6px;">{st.session_state.user_name}</div>
                <div class="user-card-label">🆔 User ID</div>
                <div class="user-id-val">{st.session_state.user_id}</div>
            </div>
            """, unsafe_allow_html=True)

        st.markdown("<br>", unsafe_allow_html=True)

        if st.button("🗑️ مسح المحادثة", use_container_width=True):
            st.session_state.messages       = []
            st.session_state.current_intent = None
            st.session_state.gpa_rows       = 1
            st.session_state.calc_result    = None
            st.session_state.plan_result    = None
            st.session_state.invalid_grades = []
            st.rerun()

        if st.button("🚪 تسجيل الخروج", use_container_width=True):
            _do_logout()

    st.markdown("""
    <div class="uniq-header">
        <h1>🤖 UNIQ AI</h1>
        <p>مساعدك الأكاديمي الذكي للمواد والمعدل والخطة الدراسية</p>
    </div>
    """, unsafe_allow_html=True)

    if is_guest:
        st.info("👤 متصل كـ **ضيف** — الأسئلة عن اللائحة الأكاديمية فقط")

    st.markdown("<div style='height:12px'></div>", unsafe_allow_html=True)

    for msg in st.session_state.messages:
        if msg["role"] == "user":
            st.markdown(f"""
            <div class="msg-user-wrap">
                <div class="bubble-user">{msg["content"]}</div>
                <div class="avatar-user">👤</div>
            </div>""", unsafe_allow_html=True)
        else:
            st.markdown(f"""
            <div class="msg-bot-wrap">
                <div class="avatar-bot">🤖</div>
                <div class="bubble-bot">{msg["content"]}</div>
            </div>""", unsafe_allow_html=True)

    if len(st.session_state.messages) == 0:
        st.markdown('<div class="sug-title">💡 اقتراحات سريعة</div>', unsafe_allow_html=True)
        col_a, col_b = st.columns(2)
        for i, sug in enumerate(SUGGESTIONS):
            target = col_a if i % 2 == 0 else col_b
            with target:
                st.markdown('<div class="sug-btn-div">', unsafe_allow_html=True)
                if st.button(sug, key=f"sug_{i}", use_container_width=True):
                    st.session_state.pending_prompt = sug
                    st.rerun()
                st.markdown('</div>', unsafe_allow_html=True)

    # ── GPA Calculator Panel ──────────────────
    if st.session_state.current_intent == "gpa_calc":
        with st.expander("🧮 GPA Calculator", expanded=True):
            st.info(st.session_state.last_bot_answer or "أدخل درجاتك لحساب المعدل")

            for i in range(st.session_state.gpa_rows):
                c1, c2 = st.columns([3, 1])
                with c1:
                    st.text_input(f"الدرجة / التقدير (مادة {i+1})", key=f"grade_{i}")
                with c2:
                    st.selectbox("الساعات", [1, 2, 3, 4], index=2, key=f"hours_{i}")

            st.markdown("<div style='height:4px'></div>", unsafe_allow_html=True)
            btn_c1, btn_c2, btn_c3 = st.columns(3)

            with btn_c1:
                if st.button("➕ إضافة مادة", key="add_row"):
                    st.session_state.gpa_rows += 1
                    st.session_state.calc_result = None
                    st.rerun()

            with btn_c2:
                if st.button("🧮 احسب الآن", key="calc_now", type="primary"):
                    valid_letters = ["A+","A","A-","B+","B","B-","C+","C","C-","D+","D","F"]
                    validated_subjects = []
                    error_found = False
                    st.session_state.invalid_grades = []

                    for i in range(st.session_state.gpa_rows):
                        grade_raw = st.session_state.get(f"grade_{i}", "").strip()
                        hours     = st.session_state.get(f"hours_{i}", 3)

                        if grade_raw:
                            cleaned = grade_raw.upper()
                            is_valid = cleaned in valid_letters
                            if not is_valid:
                                try:
                                    n = float(cleaned)
                                    is_valid = 0 <= n <= 100
                                except Exception:
                                    pass

                            if is_valid:
                                validated_subjects.append({"grade": cleaned, "credit_hours": hours})
                            else:
                                st.error(f"⚠️ القيمة '{grade_raw}' غير صحيحة!")
                                st.session_state.invalid_grades.append(i)
                                error_found = True

                    if error_found:
                        st.warning("❌ يوجد أخطاء في الدرجات، صححها أولاً.")
                    elif validated_subjects:
                        try:
                            res = requests.post(CALC_URL, json={"subjects": validated_subjects},
                                                headers={"Authorization": f"Bearer {st.session_state.jwt_token}"} if st.session_state.jwt_token else {})
                            if res.status_code == 200:
                                st.session_state.calc_result = res.json().get("gpa")
                                st.balloons()
                            else:
                                st.error(f"❌ خطأ في الحساب: {res.text}")
                        except Exception as e:
                            st.error(f"❌ تعذر الاتصال بالسيرفر: {e}")
                    else:
                        st.warning("⚠️ أدخل مادة واحدة على الأقل")

            with btn_c3:
                if st.button("❌ إغلاق", key="calc_close"):
                    st.session_state.current_intent = None
                    st.session_state.gpa_rows       = 1
                    st.session_state.calc_result    = None
                    st.session_state.invalid_grades = []
                    st.rerun()

            if st.session_state.calc_result is not None:
                st.markdown(f"""
                <div style="background:var(--surface);border:1px solid var(--border2);
                            padding:20px;border-radius:12px;text-align:center;margin-top:12px;">
                    <div style="font-size:40px;font-weight:700;color:#7b9fff;">
                        {st.session_state.calc_result}
                    </div>
                    <div style="color:var(--text3);font-size:13px;">GPA المحسوب</div>
                </div>""", unsafe_allow_html=True)

    # ── GPA Planner Panel ─────────────────────
    elif st.session_state.current_intent == "gpa_plan":
        with st.expander("🎯 GPA Planner", expanded=True):
            st.info(st.session_state.last_bot_answer or "حدد بياناتك لحساب الخطة")

            pc1, pc2 = st.columns(2)
            with pc1:
                target  = st.number_input("المعدل المستهدف",  value=3.5, min_value=0.0, max_value=4.0, step=0.1, key="plan_target")
                done    = st.number_input("الساعات المنجزة",  value=60,  min_value=0,                           key="plan_done")
            with pc2:
                current = st.number_input("المعدل الحالي",    value=2.5, min_value=0.0, max_value=4.0, step=0.1, key="plan_current")
                remain  = st.number_input("الساعات المتبقية", value=15,  min_value=1,                           key="plan_remain")

            st.markdown("<div style='height:4px'></div>", unsafe_allow_html=True)
            pb1, pb2 = st.columns(2)

            with pb1:
                if st.button("احسب الخطة", key="calc_plan", type="primary"):
                    try:
                        res = requests.post(PLAN_URL, json={
                            "target_gpa":      target,
                            "current_gpa":     current,
                            "completed_hours": done,
                            "remaining_hours": remain,
                        }, headers={"Authorization": f"Bearer {st.session_state.jwt_token}"} if st.session_state.jwt_token else {})
                        if res.status_code == 200:
                            st.session_state.plan_result = res.json()
                        else:
                            st.error(f"❌ خطأ في الحساب: {res.text}")
                    except Exception as e:
                        st.error(f"❌ تعذر الاتصال بالسيرفر: {e}")

            with pb2:
                if st.button("❌ إغلاق الخطة", key="plan_close"):
                    st.session_state.current_intent = None
                    st.session_state.plan_result    = None
                    st.rerun()

            pr = st.session_state.plan_result
            if pr is not None:
                if pr.get("possible"):
                    grades_html = "".join(
                        f'<div class="grade-item">'
                        f'<span class="grade-item-label">{m["hours"]} ساعات</span>'
                        f'<span class="grade-badge">{m["grade"]}</span>'
                        f'</div>'
                        for m in (pr.get("min_grades") or [])
                    )
                    st.markdown(f"""
                    <div class="result-card">
                        <div class="result-gpa">{pr["required_avg_gpa"]}</div>
                        <div class="result-label">المعدل الفصلي المطلوب</div>
                        <div style="font-size:12px;color:var(--text3);margin-bottom:8px;text-align:right">
                            أقل التقديرات المطلوبة
                        </div>
                        {grades_html}
                    </div>""", unsafe_allow_html=True)
                else:
                    st.error("❌ صعب توصل للمعدل المطلوب بالساعات المتبقية")

    # ── Chat Input ───────────────────────────
    user_input = st.chat_input("اسأل UNIQ عن موادك أو معدلك أو خطتك الدراسية...")

    if st.session_state.pending_prompt:
        user_input = st.session_state.pending_prompt
        st.session_state.pending_prompt = None

    if user_input:
        st.session_state.messages.append({"role": "user", "content": user_input})

        with st.spinner("🤖 جاري التفكير..."):
            try:
                headers = {"Content-Type": "application/json"}
                if st.session_state.jwt_token:
                    headers["Authorization"] = f"Bearer {st.session_state.jwt_token}"

                # ✅ بيبعت للـ Node — مش للـ chatbot مباشرة
                res = requests.post(
                    CHAT_URL,
                    json={"query": user_input},
                    headers=headers,
                    timeout=120,
                )
                if res.status_code == 200:
                    data   = res.json()
                    answer = data.get("answer", "")
                    intent = data.get("intent")

                    st.session_state.last_bot_answer = answer

                    blocked = any(m in answer for m in ["متاحة فقط للطلاب", "للطلاب المسجلين"])
                    st.session_state.current_intent = None if blocked else intent
                    st.session_state.calc_result    = None
                    st.session_state.plan_result    = None

                    html = answer
                    html = html.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
                    html = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', html)
                    html = re.sub(r'\*(.+?)\*',     r'<em>\1</em>',         html)
                    html = re.sub(r'`(.+?)`',        r'<code>\1</code>',     html)
                    html = re.sub(r'^### (.+)$',     r'<h3>\1</h3>',        html, flags=re.M)
                    html = re.sub(r'^## (.+)$',      r'<h2>\1</h2>',        html, flags=re.M)
                    html = re.sub(r'^# (.+)$',       r'<h1>\1</h1>',        html, flags=re.M)
                    html = re.sub(r'^- (.+)$',       r'<li>\1</li>',        html, flags=re.M)
                    html = re.sub(r'(<li>.*?</li>)', r'<ul>\1</ul>',        html, flags=re.S)
                    html = html.replace("\n", "<br>")

                    st.session_state.messages.append({"role": "assistant", "content": html})
                else:
                    st.session_state.messages.append({
                        "role": "assistant",
                        "content": f"❌ خطأ من السيرفر: {res.status_code} — {res.text[:200]}"
                    })
            except Exception as e:
                st.session_state.messages.append({
                    "role": "assistant",
                    "content": f"❌ تعذر الاتصال بالسيرفر: {e}"
                })

        st.rerun()


# =========================
# 🏃 MAIN ROUTER
# =========================
if st.session_state.logged_in:
    show_chat()
else:
    show_login()