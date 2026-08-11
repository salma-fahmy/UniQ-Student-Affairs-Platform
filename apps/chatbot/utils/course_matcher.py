import difflib
import re


class CourseMatcherService:

    def __init__(self, courses_catalog, llm):
        self.courses_catalog = courses_catalog
        self.llm = llm

        # normalized catalog
        self.normalized_db = {
            " ".join(k.lower().split()): k
            for k in courses_catalog.keys()
        }

        self.db_names = list(self.normalized_db.keys())

    # =========================
    # 1️⃣ LLM EXTRACTION
    # =========================
    def expand_query_to_english(self, query: str):

        prompt = f"""
You are an academic query expander. Your ONLY job is to extract the course names or academic topics mentioned in the student's query and translate them into English keywords to improve matching.

Strict Execution Rules:
1. Identify all course names or partial mentions.
2. Convert them into English academic equivalents ONLY if they are standard, clear, and you are 100% confident about the meaning.
3. CRITICAL: If a word/phrase is misspelled, garbled, unclear, or you are NOT 100% confident, you MUST return it EXACTLY as it is in the original text. Do NOT try to fix, approximate, guess, or map it to a close academic subject.
4. Do NOT guess or hallucinate any academic subject.
5. Return ONLY comma-separated keywords.
6. Do NOT include explanations, introduction, or the original query.

Examples of Handling Unclear/Misspelled Text:
- Query: "بقولك ايه الاسهل داتا اسرتاكتشر ولا الاسيبريبرللافق"
- Output: Data Structure, الاسيبريبرللافق

Student Query:
"{query}"
"""

        try:
            expanded = self.llm.invoke(prompt).content.strip()

            print(f"\n🔍 [LLM EXPANSION RAW]: {expanded}\n")

            return expanded

        except Exception as e:
            print(f"⚠️ [Query Expansion Error] {e}")
            return ""

    # =========================
    # 2️⃣ PARSE
    # =========================
    def parse_mentions(self, expanded_text: str):

        if not expanded_text:
            return []

        parts = [p.strip() for p in expanded_text.split(",")]

        cleaned = []
        for p in parts:
            p = re.sub(r"[^\w\s]", " ", p)
            p = " ".join(p.split()).strip()
            if p:
                cleaned.append(p)

        return cleaned

    # =========================
    # 3️⃣ SMART MATCHING (FIXED LOGIC)
    # =========================
    def map_to_catalog(self, mention: str):

        mention_norm = " ".join(mention.lower().split())

        best_match = None
        best_score = 0

        # 1️⃣ Word-overlap scoring (MAIN FIX)
        mention_words = set(mention_norm.split())

        for key_norm, original in self.normalized_db.items():

            key_words = set(key_norm.split())

            # overlap ratio
            overlap = len(mention_words & key_words) / max(len(key_words), 1)

            # bonus: full phrase inclusion
            if mention_norm in key_norm or key_norm in mention_norm:
                overlap += 0.3

            if overlap > best_score:
                best_score = overlap
                best_match = original

        # threshold for strong semantic match
        if best_score >= 0.55:
            return best_match

        # 2️⃣ fallback fuzzy (only if needed)
        matches = difflib.get_close_matches(
            mention_norm,
            self.db_names,
            n=1,
            cutoff=0.5
        )

        if matches:
            return self.normalized_db[matches[0]]

        return None

    # =========================
    # 4️⃣ MAIN PIPELINE
    # =========================
    def detect_courses(self, query: str):

        print("\n==============================")
        print("🧠 [COURSE MATCH PIPELINE - FIXED SEMANTIC]")
        print("==============================")

        expanded = self.expand_query_to_english(query)

        mentions = self.parse_mentions(expanded)

        print(f"🧾 LLM Mentions (Cleaned): {mentions}")

        found = []
        unmatched = []

        for m in mentions:

            matched = self.map_to_catalog(m)

            print(f"🔎 Mapping: {m} ➜ {matched}")

            if matched:

                if matched not in found:
                    found.append(matched)

            else:

                unmatched.append(m)

        print(f"🏁 FINAL COURSES: {found}")
        print(f"❌ UNMATCHED: {unmatched}")

        return {
            "mentions": mentions,
            "matched": found,
            "unmatched": unmatched
        }

    # =========================
    # VALIDATION
    # =========================
    def validate_courses(self, found_courses):
        valid = []
        invalid = []

        for c in found_courses:
            if c in self.courses_catalog:
                valid.append(c)
            else:
                invalid.append(c)

        return valid, invalid

    @staticmethod
    def clean_query(query):
        return query.lower().strip()