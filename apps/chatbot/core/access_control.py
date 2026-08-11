class AccessControl:

    def __init__(self, data_service):
        self.data_service = data_service

    # =========================
    # 👤 USER TYPE DETECTION
    # =========================
    def get_user_type(self, user_id):
        """
        تحديد نوع المستخدم:
        - student: موجود في الداتا بيز
        - guest: مش موجود / random id
        """

        student_info = self.data_service.fetch_student_data(user_id)

        if student_info and student_info.get("records"):
            return "student"

        return "guest"

    # =========================
    # 🔐 PERMISSIONS ENGINE
    # =========================
    def get_user_permissions(self, user_id):
        """
        بيرجع صلاحيات المستخدم بشكل بسيط + scalable
        """

        role = self.get_user_type(user_id)

        # =========================
        # 👨‍🎓 STUDENT PERMISSIONS
        # =========================
        if role == "student":
            return {
                "role": "student",

                # core features
                "can_access_gpa": True,
                "can_access_recommendations": True,
                "can_access_general_rag": True,
                "can_access_academic_rag": True,
                "can_use_intent_full": True,
                "allowed_rag_fields": "all",

                # future-proof (scalable hooks)
                "rate_limit": False,
                "max_tokens": None
            }

        # =========================
        # 👤 GUEST PERMISSIONS
        # =========================
        return {
            "role": "guest",

            # restricted features
            "can_access_gpa": False,
            "can_access_recommendations": False,
            "can_access_general_rag": False,

            # ONLY academic RAG allowed
            "can_access_academic_rag": True,
            "can_use_intent_full": False,
            "allowed_rag_fields": ["request_name", "description", "required_info", "rules"],

            # safety limits
            "rate_limit": True,
            "max_tokens": 800
        }

    # =========================
    # 🧠 QUICK HELPERS (optional use)
    # =========================
    def is_guest(self, user_id):
        return self.get_user_type(user_id) == "guest"

    def is_student(self, user_id):
        return self.get_user_type(user_id) == "student"