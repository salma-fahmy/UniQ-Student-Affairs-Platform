# =========================
# 📚 DATA LAYER — DB-DRIVEN VERSION
# =========================

from typing import Dict, Any, Optional


class DataService:

    def __init__(self):
        self._students_cache: Dict[str, Dict[str, Any]] = {}
        self._courses_catalog: Dict[str, Any] = {}

        # يتسجّل بعد ما الـ CourseMatcherService يتعمل في app.py
        self._course_matcher = None

    def register_matcher(self, matcher):
        """
        يتستدعى من app.py مباشرة بعد إنشاء CourseMatcherService.
        بيخلي DataService يقدر يعمل refresh للـ matcher
        لما الـ catalog يتحدث — من غير ما نعدل على course_matcher.py.
        """
        self._course_matcher = matcher

    # =========================
    # COURSES API
    # =========================

    def set_courses_catalog(self, catalog: Dict[str, Any]):
        """
        يتستدعى مع كل request من الـ Node.js.
        بعد التحديث يعمل refresh للـ matcher تلقائياً
        بيحدّث الـ 3 attributes جوا CourseMatcherService مباشرة
        من غير ما نعدل على الفايل ده.
        """
        if catalog == self._courses_catalog:
            return  # مفيش تغيير — مش هنعيد البناء

        self._courses_catalog = catalog

        # ── refresh الـ CourseMatcherService بدون تعديل عليه ──
        if self._course_matcher is not None:
            self._course_matcher.courses_catalog = catalog
            self._course_matcher.normalized_db = {
                " ".join(k.lower().split()): k
                for k in catalog.keys()
            }
            self._course_matcher.db_names = list(
                self._course_matcher.normalized_db.keys()
            )

    def fetch_courses_catalog(self) -> Dict[str, Any]:
        return self._courses_catalog

    # =========================
    # STUDENT API
    # =========================

    def set_student_data(self, user_id: str, student_data: Dict[str, Any]):
        """
        يتستدعى في كل /chat request للـ student.
        الـ Node.js بيبعت:
          {
            "name":       str,
            "department": str,
            "records":    { course_name: { grade, credit_hours }, ... }
          }
        """
        raw_records = student_data.get("records") or {}
        records: Dict[str, Any] = {
            course_name: {
                "grade":        info.get("grade", ""),
                "credit_hours": info.get("credit_hours", 3),
            }
            for course_name, info in raw_records.items()
        }

        self._students_cache[user_id] = {
            "name":         student_data.get("name", "Unknown"),
            "department":   student_data.get("department"),
            "records":      records,
            "chat_history": [],
        }

    def fetch_student_data(self, user_id: str) -> Dict[str, Any]:
        student_info = self._students_cache.get(user_id)

        if not student_info:
            return {
                "name":         "Guest",
                "department":   None,
                "records":      {},
                "chat_history": [],
            }

        return {
            "name":         student_info.get("name", "Unknown"),
            "department":   student_info.get("department"),
            "records":      student_info.get("records", {}),
            "chat_history": student_info.get("chat_history", []),
        }

    # =========================
    # COMPATIBILITY PROPS
    # =========================
    @property
    def COURSES_CATALOG(self) -> Dict[str, Any]:
        return self._courses_catalog