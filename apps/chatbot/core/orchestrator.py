import re
from utils.rate_limiter import RateLimiter
class OrchestratorService:

    def __init__(
        self,
        intent_service,
        rag_service,
        academic_rag_service,
        gpa_service,
        memory_service,
        llm_service,
        course_matcher,
        recommendation_service,
        ui_service,
        data_service,
        access_control=None
    ):
        self.intent_service = intent_service
        self.rag_service = rag_service
        self.academic_rag_service = academic_rag_service
        self.gpa_service = gpa_service
        self.memory_service = memory_service
        self.llm_service = llm_service

        self.course_matcher = course_matcher
        self.recommendation_service = recommendation_service

        self.ui_service = ui_service
        self.data_service = data_service

        self.access_control = access_control

        # 🔥 NEW: rate limiter instance
        self.rate_limiter = RateLimiter()

    def _build_context_block(self, rag_results, permissions):
        context_list = []
        
       
        allowed_fields = permissions.get("allowed_rag_fields", ["request_name", "description", "required_info", "rules"])
        
        for item in rag_results:
            c = item["intent"]
 
            if allowed_fields == "all":
                rules = ". ".join(c.get('rules', [])) or "لا توجد شروط أو قواعد"
                info = ", ".join(c.get('required_info', [])) or "لا توجد"
                
                steps_before_str = " ثم ".join(c.get('steps_before', [])) if c.get('steps_before') else "لا يوجد خطوات تمهيدية"
                steps_after_str = " ثم ".join(c.get('steps_after', [])) if c.get('steps_after') else "لا يوجد خطوات نهائية"
              
                block = (
                    f"[SERVICE NAME]: {c.get('request_name')}\n"
                    f"[SERVICE DESCRIPTION]: {c.get('description')}\n"
                    f"[REQUIRED DOCUMENTS]: {info}\n"
                    f"[STRICT RULES AND BYLAWS]: {rules}\n"
                    f"[OPERATIONAL STEPS BEFORE OPENING FORM]: {steps_before_str}\n"
                    f"[OPERATIONAL STEPS AFTER OPENING AND PAYMENT]: {steps_after_str}\n"
                )
                if 'fees' in c: block += f"[FEES]: {c.get('fees')}\n"
                if 'category' in c: block += f"📂 التصنيف: {c.get('category')}\n"
                if 'response_hint' in c: block += f"💡 تلميح داخلي: {c.get('response_hint')}\n"
                
            else:
                block_parts = []
                if "request_name" in allowed_fields:
                    block_parts.append(f"📄 الموضوع: {c.get('request_name')}")
                if "description" in allowed_fields:
                    block_parts.append(f"📝 الوصف والمعلومات: {c.get('description')}")
                if "required_info" in allowed_fields:
                    info = ", ".join(c.get('required_info', [])) or "غير محددة"
                    block_parts.append(f"✅ الأوراق المطلوبة: {info}")
                if "rules" in allowed_fields:
                    rules = ". ".join(c.get('rules', [])) or "لا توجد قواعد إضافية"
                    block_parts.append(f"⚠️ القواعد واللايحة: {rules}")
                
                block = "\n".join(block_parts)
                
            context_list.append(block)
            
        return "\n\n---\n\n".join(context_list)
    

    # =========================
    # MAIN ENGINE (MEMORY-STABLE VERSION)
    # =========================
    def generate_uniq_response(self, user_id, query):
        from utils.formatters import format_course_results
        from langchain_core.messages import HumanMessage, AIMessage
 

        # =========================
        # MEMORY INIT (THREAD-SAFE)
        # =========================
        session = self.memory_service.get_or_create_session(user_id)

        self.memory_service.update_last_active(session)

        session.setdefault("chat_history", [])
        session.setdefault("memory_summary", "")
        session.setdefault("last_intent", None)

        # 🚨 RATE LIMIT PROTECTION (FIRST LINE)
        allowed, wait_seconds = self.rate_limiter.allow_request(user_id)
        if not allowed:
            return (
                f"⚠️ استنى {wait_seconds} ثانية قبل ما تبعت رسالة تانية عشان السيرفر مشغول",
                "rate_limited",
                0.0
            )
        # =========================
        # 🔐 ACCESS CONTROL
        # =========================
        permissions = {
            "role": "student",
            "can_access_gpa": True,
            "can_access_recommendations": True,
            "can_access_general_rag": True,
            "can_access_academic_rag": True
        }

        if self.access_control:
            permissions = self.access_control.get_user_permissions(user_id)

        is_guest = permissions["role"] == "guest"

   
        # =========================
        # 1. RELATION DETECTION
        # =========================

        relation = "NEW"

        if session.get("chat_history"):

            relation = self.intent_service.detect_topic_shift(
                query,
                session["chat_history"]
            ).strip().upper()

        # =========================
        # 2. QUERY REWRITE (ONLY IF SAME)
        # =========================

        if relation == "SAME" and session.get("chat_history"):

            print("🔗 SAME TOPIC → APPLYING REWRITE")

            resolved_query = self.intent_service.rewrite_query(
                query,
                session["chat_history"]
            )

            print(f"🔄 Rewritten Query: {resolved_query}")

        else:

            print("🧨 NEW TOPIC → NO REWRITE")

            resolved_query = query
            

        # =========================
        # 3. FINAL INTENT CLASSIFICATION
        # =========================

        current_label, current_confidence = (
            self.intent_service.classify_intent(resolved_query)
        )

        print("\n==============================")
        print("🧠 FINAL FLOW DEBUG")
        print("==============================")
        print(f"📝 Original Query: {query}")
        print(f"🔎 Relation: {relation}")
        print(f"🔄 Resolved Query: {resolved_query}")
        print(f"🏷️ Final Intent: {current_label}")
        print(f"📊 Confidence: {current_confidence:.4f}")
        print("==============================\n")



        # =========================
        # 🚫 GUEST ACCESS RESTRICTIONS
        # =========================
        if is_guest:

            blocked_intents = [
                "gpa_calc",
                "gpa_plan",
                "course_rec"
            ]

            # أي Intent غير مسموح
            if current_label in blocked_intents:

                return (
                    "❌ هذه الخدمة متاحة فقط للطلاب المسجلين في النظام.",
                    current_label,
                    current_confidence
                )



        # ✅ SAFE UPDATE
        self.memory_service.set_session_value(
            user_id,
            "last_intent",
            current_label
        )

        # =========================
        # 🧹 CLEAN OLD TOPICS FROM MEMORY
        # =========================
        if relation == "NEW" and session.get("chat_history"):
            print("🧹 SHRINKING CONTEXT WINDOW")
            reduced_history = session["chat_history"][-2:]
            session["chat_history"] = reduced_history
            self.memory_service.set_session_value(
                user_id,
                "chat_history",
                reduced_history
            )
        # =========================
        # CHAT HISTORY PREP
        # =========================
        chat_history = session["chat_history"]

        compressed_history = chat_history[
            -self.memory_service.MAX_HISTORY_MESSAGES:
        ]

        memory_summary = session.get("memory_summary", "")

        chat_history_payload = (
            (
                [{"role": "system", "content": memory_summary}]
                if memory_summary else []
            )
            +
            self.memory_service.format_chat_history(
                compressed_history
            )
        )

        # =========================
        # STUDENT DATA
        # =========================
        # =========================================================
        # 👤 STUDENT DATA FETCHING & SESSION ORCHESTRATION
        # =========================================================
        current_records = session.get("records")

        # ✅ SAFE FIX FOR GUEST USERS & DYNAMIC DATA SYNCHRONIZATION
        if not is_guest and not current_records:
         
            student_info = self.data_service.fetch_student_data(user_id)

            current_records = {
                "student_info": {
                    "name": student_info.get("name", "Unknown"),
                    "department": student_info.get("department")  
                },
                "records": student_info.get("records", {})  
            }

            # ✅ SAFE UPDATE IN MEMORY
            self.memory_service.set_session_value(
                user_id,
                "records",
                current_records
            )

        else:
            current_records = current_records or {}
            if "records" not in current_records:
                current_records["records"] = {}
            if "student_info" not in current_records:
                current_records["student_info"] = {
                    "name": "Guest" if is_guest else "Unknown",
                    "department": None
                }

        # =========================
        # COURSE DETECTION
        # =========================
        found_courses = []

        unmatched_courses = []

        if current_label == "course_rec":

            course_detection = (
                self.course_matcher.detect_courses(
                    resolved_query
                )
            )

            found_courses = course_detection["matched"]

            unmatched_courses = (
                course_detection["unmatched"]
            )
        else:
            print("🚫 [COURSE MATCH SKIPPED] intent is not course_rec")

        answer = None

        # =========================
        # UI ROUTING (SAFE FOR API)
        # =========================
        if current_label == "gpa_calc":

            if self.ui_service:
                self.ui_service.show_gpa_calc_form()

            return (
                "📝 فورم حساب الـ GPA ",
                current_label,
                current_confidence
            )

        elif current_label == "gpa_plan":

            if self.ui_service:
                self.ui_service.show_gpa_plan_form()

            return (
                "🎯 فورم خطة الـ GPA ",
                current_label,
                current_confidence
            )

        elif current_label not in ["gpa_calc", "gpa_plan"]:

            if self.ui_service:
                self.ui_service.clear_form_output()

        # =========================
        # COURSE RECOMMENDATION
        # =========================
        # =========================================================================
        # 🤖 COURSE RECOMMENDATION HANDLER (CLEAN & PROFESSIONAL OUTPUT)
        # =========================================================================
        import logging

        logger = logging.getLogger("course_rec")

        if current_label == "course_rec":

            if not permissions["can_access_recommendations"]:
                answer = "❌ خدمة ترشيح المواد متاحة فقط للطلاب المسجلين."
            else:
                # ✅ SAFE CHECK FOR EXTRACTED COURSES
                found_courses_list = locals().get("found_courses") or locals().get("extracted_courses") or []

                if not found_courses_list:
                    answer = (
                        "❌ لم أتمكن من التعرف على أي مادة في سؤالك.\n\n"
                        "📌 اكتب اسم المادة كما هو موجود في اللائحة أو الاسم الكامل.\n"
                        "مثال:\n"
                        "- Data Mining and Analytics\n"
                        "- Artificial Intelligence\n"
                        "- Operating Systems"
                    )
                    unmatched_courses_list = locals().get("unmatched_courses") or []
                    if unmatched_courses_list:
                        answer += "\n\n🔍 المواد غير المفهومة:\n" + "\n".join(f"- {c}" for c in unmatched_courses_list)
                else:

                    logger.debug("========== COURSE REC DEBUG ==========")
                    logger.debug(f"current_records keys: {list(current_records.keys()) if isinstance(current_records, dict) else 'Not a dict'}")

                    student_current_dept = None
                    if isinstance(current_records, dict):
                        if "student_info" in current_records:
                            student_current_dept = current_records["student_info"].get("department")
                        if not student_current_dept:
                            student_current_dept = current_records.get("department")

                    if not student_current_dept:
                        student_current_dept = "عام"
                        logger.warning("Department missing from student records, fallback used: عام")

                    logger.debug(f"student_current_dept: {student_current_dept}")
                    raw_records_to_send = {}
                    if isinstance(current_records, dict):
                        if "records" in current_records and isinstance(current_records["records"], dict):
                            raw_records_to_send = current_records["records"]
                        elif any(isinstance(v, dict) and "grade" in v for v in current_records.values()):
                            raw_records_to_send = current_records
                        else:
                            for k, v in current_records.items():
                                if isinstance(v, dict) and "records" in v:
                                    raw_records_to_send = v["records"]
                                    if "department" in v:
                                        student_current_dept = v["department"]
                                    break
                                elif isinstance(v, dict) and "grade" in v:
                                    raw_records_to_send[k] = v

                    results, ranked, grouped_results = self.recommendation_service.recommend_course(
                        found_courses_list,
                        raw_records_to_send,  
                        self.data_service.COURSES_CATALOG,
                        student_dept=student_current_dept
                    )

                    TYPE_TRANSLATION = {
                        "university_obligatory": "⚙️ مواد إجبارية الجامعة",
                        "faculty_obligatory": "🏫 مواد إجبارية الكلية",
                        "program_obligatory": "💻 مواد إجبارية القسم / التخصص",
                        "university_elective": "🌍 مواد اختيارية الجامعة",
                        "faculty_elective": "📚 مواد اختيارية الكلية",
                        "program_elective": "🔬 مواد اختيارية القسم / التخصص"
                    }

                    dynamic_sections = []

                    for c_type, group in grouped_results.items():
                        type_title = TYPE_TRANSLATION.get(c_type, f"📦 مواد تصنيف {c_type}")
                        requested_filtered = [r for r in group["requested_courses"] if not r.get("already_completed")]
                        ranked_filtered = [r for r in group["ranked_eligible"] if not r.get("already_completed")]
                        
                        completed_before = group["completed_before"]
                        ceiling_max = group["ceiling_max"]

                        if not requested_filtered and not ranked_filtered:
                            continue

                        section_body = ""

                        if "elective" in str(c_type).lower():
                            count_completed = len(completed_before)
                            if ceiling_max:
                                section_body += f"📊 أنت بالفعل مخلص **{count_completed}** مواد من أصل **{ceiling_max}** مطلوبين في اللائحة للمجموعة دي "
                                if completed_before:
                                    section_body += f"وهم: ({', '.join(completed_before)})\n"
                                else:
                                    section_body += "\n"
                            else:
                                section_body += f"📊 أنت مخلص {count_completed} مواد في المجموعة دي سابقاً.\n"

                            is_bucket_full = ceiling_max and count_completed >= ceiling_max
                            if is_bucket_full:
                                section_body += "💡 *بص، أنت مستوفي ساعات المجموعة دي بالكامل، بس لو عايز تسجل مادة كمان زيادة معرفة كعلم إضافي فالمواد المتاحة ليك:* \n"

                        if ranked_filtered:
                            best = ranked_filtered[0]
                            
                            if best.get("auto_recommended"):
                                section_body += f"✔️ الترشيح الأول والأفضل ليك هو مادة **{best['course']}**، لأنها مفيهاش أي متطلبات سابقة وسهلة تخلصها وترفع مجموعك. 👌\n"
                            else:
                                gpa_label = f"GPA: {best['gpa']:.2f}" if best.get("gpa") is not None else "غير محسوب"
                                
                                prereqs_passed = best.get("completed_prereqs") or []
                                if not prereqs_passed:
                                    course_key = best["course"]
                                    catalog_info = self.data_service.COURSES_CATALOG.get(course_key, {})
                                    catalog_prereqs = catalog_info.get("prerequisites") or catalog_info.get("prereqs") or []
                                    if isinstance(catalog_prereqs, str):
                                        catalog_prereqs = [catalog_prereqs]
                                    prereqs_passed = [
                                        p for p in catalog_prereqs 
                                        if p in raw_records_to_send and str(raw_records_to_send[p].get("status", "")).lower() != "failed"
                                    ]
                                
                                prereq_details = f" ({', '.join(prereqs_passed)})" if prereqs_passed else " السابقة"
                                
                                section_body += f"✔️ الاختيار الأنسب والأعلى أولوية ليك هو مادة **{best['course']}** بناءً على أدائك الممتاز في متطلباتها{prereq_details} بمعدل ({gpa_label}). 🔥\n"
                            
                            other_eligible = [c for c in ranked_filtered if c["course"] != best["course"] and c["eligible"]]
                            
                            if other_eligible:
                                section_body += "📌 وباقي المواد المتاحة ليك تسجلها في المجموعة دي مترتبة حسب الأفضلية الدقيقة:\n"
                                for alternative in other_eligible:
                                    if alternative.get("auto_recommended"):
                                        section_body += f"   - مادة **{alternative['course']}** (مادة حرة بدون متطلبات سابقة وسهلة التسجيل).\n"
                                    else:
                                        alt_gpa_label = f"GPA: {alternative['gpa']:.2f}" if alternative.get("gpa") is not None else "غير محسوب"
                                        
                                        alt_prereqs = alternative.get("completed_prereqs") or []
                                        if not alt_prereqs:
                                            alt_key = alternative["course"]
                                            alt_catalog = self.data_service.COURSES_CATALOG.get(alt_key, {})
                                            alt_catalog_prereqs = alt_catalog.get("prerequisites") or alt_catalog.get("prereqs") or []
                                            if isinstance(alt_catalog_prereqs, str):
                                                alt_catalog_prereqs = [alt_catalog_prereqs]
                                            alt_prereqs = [
                                                p for p in alt_catalog_prereqs 
                                                if p in raw_records_to_send and str(raw_records_to_send[p].get("status", "")).lower() != "failed"
                                            ]
                                            
                                        alt_prereq_details = f" ({', '.join(alt_prereqs)})" if alt_prereqs else ""
                                        
                                        section_body += f"   - مادة **{alternative['course']}** مخلص متطلباتها{alt_prereq_details} بمعدل {alt_gpa_label}.\n"

                        # =========================================================
                        # ❌ HANDLE LOCKED / INELIGIBLE COURSES
                        # =========================================================
                        for ne in requested_filtered:
                            if not ne["eligible"]:
                                if ne.get("dept_lock"):
                                    section_body += f"🔒 مادة **{ne['course']}** مش هينفع تاخدها خالص لأنها تابعة لقسم ({ne.get('course_dept')}) وأنت مسجل في قسم ({student_current_dept}).\n"
                                else:
                                    section_body += f"❌ مادة **{ne['course']}** مش هينفع تاخدها حالياً عشان مخلصتش متطلباتها: ({', '.join(ne['missing'] or ne['failed'] or ne['incomplete'])}).\n"

                        if "obligatory" in str(c_type).lower() and requested_filtered:
                            if not any(c.get("dept_lock") for c in requested_filtered):
                                section_body += "💡 *كده كده المواد دي إجبارية، ولازم تخلصهم كلهم عشان مفيش تخرج من غيرهم.*\n"

                        section_text = f"### **{type_title}**\n" + section_body
                        dynamic_sections.append(section_text)

                    answer = "🤖 بص يا صاحبي، بناءً على تحليلي الدقيق لموقفك الأكاديمي وتوزيع المواد في اللائحة وقسمك العلمي:\n\n"
                    answer += "\n".join(dynamic_sections)

                    completed_in_query = [r["course"] for r in results if r.get("already_completed")]
                    if completed_in_query:
                        answer += f"\n\nℹ️ **أنت بالفعل مخلص المواد دي بنجاح سابقاً:**\n" + "\n".join(f"- {c}" for c in completed_in_query)

                    unmatched_courses_list = locals().get("unmatched_courses") or locals().get("unmatched_courses_list") or []
                    if unmatched_courses_list:
                        answer += f"\n\n⚠️ **مواد مش واضحة في السيستم ياريت تكتبها زي اللايحه:**\n" + "\n".join(f"- {c}" for c in unmatched_courses_list)

        if current_label == "general_query":
         
                # ============================================
                # 🧠 ROUTER
                # ============================================

                from utils.token_counter import TokenCounter
                import re

                token_counter = TokenCounter()

                router_system = self.llm_service.build_prompt(
            """You are a strict, bulletproof routing system for a university chatbot.
Your ONLY job is to analyze the user's rewritten standalone query and route it to 'rag1', 'rag2', or 'hybrid'.

THE CORE RAG1 FILTER ENGINE (STRICTLY ENFORCED):

A query (or part of it) matches `rag1` ONLY if it directly asks about one of these core administrative/financial triggers regarding college services, certificates, complaints, or applications:
1. **Financials / Money / Cost**: Prices, costs, fees, or payments (e.g., بكام، مصاريف، رسوم، سداد، دفع، قسط، غرامة، فلوس، تكلفة).
2. **Physical Steps / Procedures / Actions**: How to physically do, apply, or obtain something (e.g., خطوات عمل، ازاي اعمل، طريقة تقديم، ازاي اطلع، خطوات سحب، تقديم شكوى، ابلغ عن).
3. **Official Papers / Certificates / Forms**: Physical documents, transcripts, or certificates (e.g., ورق، مستندات، شهادة، مستخرج، إفادة، استمارة، كارنيه، نموذج، طلب ورق).
4. **Greetings, Identity, & Capabilities**: Any welcoming words, greetings, or questions about the chatbot's identity, what it does, or how it can help (e.g., سلام، ازيك، مرحبا، انت مين، بتعمل ايه، تقدر تساعدني ازاي، وظيفتك ايه).
5. **Complaints / Issues / Reports**: ANY question that mentions or is about complaints in any way — including filing, submitting, tracking, understanding types, or asking about differences between complaint categories (e.g., شكوى، شكاوي، بلاغ، اعتراض، اشتكي، رفع شكوى، انواع الشكاوي، الفرق بين الشكاوي، متابعة شكوى).

THE CATCH-ALL DEFAULT (rag2):
- ANY query (or part of it) that does NOT explicitly trigger the financial, procedural, physical document, or greeting/identity filters of `rag1` MUST AUTOMATICALLY go to `rag2`.
- Do NOT try to overthink academic concepts. If it is NOT about money, physical steps, official paperwork/certificates, or bot greetings/identity, it is `rag2`.

THE SPLIT INTENT FILTER (hybrid):
- The query explicitly contains TWO distinct parts: one part triggers the `rag1` filter (money/steps/papers/greetings) AND the other part does NOT trigger it (falls into `rag2`).

CRITICAL ROUTING GUARDRAILS:
- Look at the ACTION, not just the keywords:
  - "خطوات إيقاف القيد" / "إيقاف القيد بكام" ➔ Triggers `rag1` (Steps / Money).
  - "تأثير إيقاف القيد عليا" / "يعني ايه 6 ساعات معتمدة" ➔ Does NOT trigger `rag1` ➔ Automatically `rag2`.
  - "ممنوع التحويل من خاص لعام" ➔ Bylaw rule, no steps or money ➔ Automatically `rag2`.
  - "ازاي اقدم للقسم الخاص" ➔ Triggers `rag1` (How-to procedure).
  - "اهلاً انت بتعمل ايه هنا" ➔ Triggers `rag1` (Greeting and Identity).
  - "ازاي ارفع شكوى" / "ايه الفرق بين انواع الشكاوي" / "عايز اشتكي" ➔ Triggers `rag1` (Complaints).

- **CRITICAL — ACADEMIC VALUES ARE NOT MONEY**:
  Words like "من كام", "قد ايه", "كام" when used in an ACADEMIC context (GPA thresholds, grades, credit hours, honor requirements) are asking for a NUMERIC ACADEMIC VALUE, NOT a price or fee.
  ALWAYS ask: "Is this asking about paying money to the university, OR asking about an academic number/threshold?"
  - "معدل الامتياز من كام" ➔ Academic threshold question ➔ NOT rag1 ➔ `rag2`
  - "الامتياز من كام ساعة" ➔ Academic credit hour question ➔ NOT rag1 ➔ `rag2`
  - "الـ gpa من كام عشان اتخرج" ➔ Academic requirement question ➔ NOT rag1 ➔ `rag2`
  - "رسوم التخرج بكام" ➔ Fee question ➔ Triggers rag1

FEW-SHOT EXAMPLES FOR TRAINING:
- Query: "بقولك هو اعمل ايه علشان اقدم في الكليه"
  THINKING: The student is asking for the physical application procedure and steps ("اعمل ايه عشان اقدم") ➔ Triggers rag1 filter.
  ROUTE: rag1

- Query: "هو اثبات القيد بكام"
  THINKING: The student is asking about the financial cost/fees ("بكام") of an official service ➔ Triggers rag1 filter.
  ROUTE: rag1

- Query: "وصف المشكلة في الشكوى العامة يعني ايه"
  THINKING: The student is asking about a complaint ("الشكوى") ➔ Triggers rag1 filter (Complaints).
  ROUTE: rag1

- Query: "هو ايه الفرق بين انواع الشكاوي"
  THINKING: The student is asking about complaint types ("انواع الشكاوي"). Any question mentioning complaints triggers rag1 filter (Complaints).
  ROUTE: rag1

- Query: "هو ممكن احول من القسم العام للخاص"
  THINKING: The student is asking about a university transfer rule/possibility, NOT asking for physical steps, money, or documents ➔ Does NOT trigger rag1 filter ➔ Default to rag2.
  ROUTE: rag2

- Query: "عايز اعرف خطوات التحويل للقسم الخاص وهل بياخد من gpa كام"
  THINKING: Part 1 ("خطوات التحويل للقسم الخاص") triggers rag1 filter (Procedure). Part 2 ("وهل بياخد من gpa كام") is an academic requirement that does NOT trigger rag1 (Default to rag2) ➔ Split intent detected.
  ROUTE: hybrid

- Query: "السلام عليكم، انت مين وبتقدر تساعدني في ايه؟"
  THINKING: The student is greeting the bot and asking about its identity and capabilities ➔ Triggers rag1 filter (Greetings, Identity, & Capabilities).
  ROUTE: rag1

- Query: "هو معدل الامتياز من كام"
  THINKING: The student is asking about an academic GPA threshold for honors ("معدل الامتياز"), not about paying fees or money. "من كام" here refers to a numeric academic value, not a price ➔ Does NOT trigger rag1 filter ➔ Default to rag2.
  ROUTE: rag2

- Query: "الـ gpa المطلوب للامتياز قد ايه"
  THINKING: The student is asking about an academic GPA requirement, "قد ايه" refers to an academic threshold not a financial cost ➔ Does NOT trigger rag1 filter ➔ Default to rag2.
  ROUTE: rag2

- Query: "ازاي ارفع شكوى على دكتور"
  THINKING: The student is asking about filing a complaint ("ارفع شكوى") ➔ Triggers rag1 filter (Complaints).
  ROUTE: rag1

- Query: "عايز اشتكي من نتيجة امتحان"
  THINKING: The student wants to submit a complaint ("اشتكي") about an exam result ➔ Triggers rag1 filter (Complaints).
  ROUTE: rag1

Respond ONLY in this exact format (Lowercase routes):
THINKING: [brief analysis based on rag1 filters]
ROUTE: [rag1 or rag2 or hybrid]
"""
        )

                router_result = self.llm_service.generate_llm_response(
                    router_system,
                    f"Question: {resolved_query}",
                    "",
                    [],
                )

                raw_route = router_result.strip().lower()
                
                route_line = next((l for l in raw_route.splitlines() if "route:" in l), raw_route)
                match = re.search(r"\b(rag1|rag2|hybrid)\b", route_line)
                route     = match.group(1) if match else "rag2"

                print(f"🧠 [ROUTER] raw='{raw_route}' → route={route}")
                router_intent = None
                router_subintent = None
                intent_match = re.search(r"intent:\s*(\w+)", raw_route)
                subintent_match = re.search(r"subintent:\s*(\w+)", raw_route)
               
                if intent_match:
                    router_intent = intent_match.group(1).lower()
                if subintent_match:
                    router_subintent = subintent_match.group(1).lower()
                # ====================================================
                use_rag1 = route in ("rag1", "hybrid")
                use_rag2 = route in ("rag2", "hybrid")

                # ============================================
                # 🔍 CONDITIONAL RETRIEVAL
                # ============================================
                RAG1_SCORE_THRESHOLD = 0.45
                RAG2_MIN_CONTEXT_LEN = 150

                rag1_context = ""
                rag2_context = ""

                # ── RAG1 RETRIEVAL ──────────────────────
                if use_rag1 and self.rag_service:
                    rag1_results, rag1_score, _ = self.rag_service.retrieve_with_score(
                        resolved_query,
                        top_k=2,
                        allowed_fields=permissions.get("allowed_rag_fields", "all"),
                    )

                    if rag1_results and rag1_score >= RAG1_SCORE_THRESHOLD:
                        rag1_context = token_counter.safe_trim_context(
                            self._build_context_block(rag1_results, permissions),
                            max_tokens=1200,
                        )
                        print(f"✅ [RAG1] score={rag1_score:.3f} → accepted.")
                    else:
                        print(f"⚠️ [RAG1] score={rag1_score:.3f} → below threshold, switching to RAG2 only")
                        use_rag1 = False
                        use_rag2 = True

                # ── RAG2 ──────────────────────────────────
                if use_rag2 and self.academic_rag_service:
                    result      = self.academic_rag_service.full_pipeline({"question": resolved_query})
                    # ======= [تعديل الـ Subintent - المكان الثاني] =======
                    rag_input = {
                        "question": resolved_query,
                        "router_intent": router_intent,
                        "router_subintent": router_subintent
                    }
                    result      = self.academic_rag_service.full_pipeline(rag_input)
                    raw_context = result.get("context", "")
                    course_subintent = result.get("course_subintent")
                    # ====================================================
                    raw_context = result.get("context", "")

                    if len(raw_context.strip()) >= RAG2_MIN_CONTEXT_LEN:
                        rag2_context = token_counter.safe_trim_context(raw_context, max_tokens=2400)
                        print(f"✅ [RAG2] len={len(raw_context)} → accepted")
                    else:
                        use_rag2 = False
                        print(f"❌ [RAG2] len={len(raw_context)} → too short, gated out")

                # hybrid correction بعد ما الـ retrieval اتحدد
                if route == "hybrid" and not rag1_context:
                    print("⚠️ [HYBRID] RAG1 context empty → downgrading to RAG2 only")
                    use_rag1 = False
                    use_rag2 = True

                # ============================================
                # 🎯 GENERATION 
                # ============================================
                service_answer = ""
                bylaw_answer   = ""

                if use_rag1 and rag1_context:
                    service_answer = self.llm_service.generate_llm_response(
                        self.llm_service.build_prompt(self.llm_service.build_system_prompt()),
                        query,  
                        rag1_context, 
                        chat_history_payload,
                    )

# ======= [تعديل الـ Subintent - المكان الثالث] =======
                if use_rag2 and rag2_context:
                    bylaw_answer = self.llm_service.generate_laiha_response(
                        question=query,
                        context=rag2_context,
                        intent=result.get("intent", "general_rules"),
                        course_subintent=course_subintent,
                        chat_history=chat_history_payload
                    )
                # ====================================================

                # ============================================
                # 🧩 FINAL COMPOSE
                # ============================================
                if service_answer and bylaw_answer:
                    answer = (
                        f"{service_answer}\n\n"
                        f"---\n"
                        f"📚 **بناءً على اللائحة الأكاديمية:**\n\n"
                        f"{bylaw_answer}"
                    )
                elif service_answer:
                    answer = service_answer
                elif bylaw_answer:
                    answer = bylaw_answer
                else:
                    answer = "عذراً، لم أستطع العثور على إجابة دقيقة في قاعدة البيانات الحالية."

        # memory
        self.memory_service.add_message(
            user_id,
            HumanMessage(content=query)
        )

        self.memory_service.add_message(
            user_id,
            AIMessage(content=str(answer))
        )


        self.memory_service.update_memory(session)

        return answer, current_label, current_confidence