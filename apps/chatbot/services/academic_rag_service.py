import os
from langchain_core.runnables import RunnableLambda
from langchain_core.output_parsers import StrOutputParser
import re
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.retrievers import BM25Retriever
from langchain_classic.retrievers import EnsembleRetriever
from langchain_core.documents import Document


class AcademicRAGService:
    def __init__(self, llm_service, vectordb, ensemble_retriever):
        self.llm_service = llm_service
        self.llm = llm_service.llm
        self.vectordb = vectordb
        self.ensemble_retriever = ensemble_retriever
        print(" [AcademicRAG] Service initialized in 100% CLONE MODE")

    def expand_query_to_english(self, query: str) -> str:
    
            prompt = f"""
    
            You are an academic query expander. Your ONLY job is to extract the course names or academic topics mentioned in the student's query and translate them into English keywords to improve search retrieval. Do NOT try to answer the question or guess prerequisites.
    
            Instructions:
            1. Identify the course name(s) mentioned by the student.
            2. Provide the English translation or common academic synonyms for those specific courses.
            3. If no specific course is mentioned (asking about general rules), just extract the main topic keywords (e.g., GPA, absence, warning).
            4. If the user mentions a specific academic year or level (e.g., سنه تالته, تالتة, مستوى ثالث, Level 3, Third Year), you MUST explicitly include the exact english keywords: "Third Level", "Level 3", "Third Year" in the output.
            5.Translate the academic year or level into "Level X" and map the semester into "Semester Y" correctly based on standard university structures (e.g., Year 3 Term 2 should naturally map to Level 3 Semester 6).
            Student Query: "{query}"
    
            Output strictly in this format (one line, no explanations):
    
            Arabic Keywords | English Keywords
    
            Return ONLY the exact English course name.
    
            Do not generate synonyms.
    
            Do not generate related topics.
    
            """
    
            try:
    
                expanded = self.llm.invoke(prompt).content.strip()
    
                print(f" [Query Expansion] {query} ➔ {expanded}")
    
                expanded_cleaned = re.sub(r'(arabic|english|keywords|format|output|:|\|)', ' ', expanded, flags=re.IGNORECASE)
                expanded_cleaned = " ".join(expanded_cleaned.split())
            
                print(f" [Query Expansion Cleaned] {query} ➔ {expanded_cleaned}")
                return f"{query} {expanded_cleaned}"    
            except Exception as e:
    
                print(f" [Query Expansion Error] {e}")
    
                return query
    def classify_intent_academic(self, query: str) -> str:
        prompt = f"""
        You are an academic intent classifier.               Classify the student's question into EXACTLY ONE category.               courses:
        - Questions about courses or subjects
        - Prerequisites
        - Course dependencies
        - Courses unlocked by another course
        - Semester courses
        - Course descriptions
        - Course registration eligibility
        - Study plans
        - What courses will be blocked if a course is failed               general_rules:
        - GPA
        - Academic warnings
        - Attendance rules
        - Grades and grading system
        - Honor list
        - Graduation requirements
        - College regulations
        - Academic bylaws
        - University policies
        - Any rule in the academic regulations               Question:
        "{query}"               Return ONLY one word:               courses
        general_rules
        """
        try:
            res = self.llm.invoke(prompt).content.strip().lower()
            print(f" [Intent AI Thought]: {res}")
            if res == "courses":
                return "courses"
            if res == "general_rules":
                return "general_rules"
            if "course" in res:
                return "courses"
            return "general_rules"
        except Exception as e:
            print(f" [Intent Classification Error]: {e}")
            return "general_rules"

    def classify_course_subintent(self, query: str) -> str:
        prompt = f"""
        You are a precise course question classifier.
        Classify the student's question into EXACTLY ONE category.

        Categories:
        - prerequisite → asks about what is required BEFORE taking a course (متطلبات سابقة)
        - postrequisite → asks what courses are unlocked / opened / بعد by a course (المواد اللي بتفتحها)
        - blocked_courses → asks what courses become unavailable if failed
        - course_description → asks about content, topics, what the course is about
        - course_credits → asks about number of credit hours
        - course_semester / course_level → asks in which semester or year
        - course_list → asks for list of courses in a semester/year
        - Program Elective / Faculty Elective / University Elective
        - Program Compulsory / Faculty Compulsory / University Compulsory

        Question: "{query}"

        Important Examples:
        - "اي مواد بتفتحها Linear Algebra" → postrequisite
        - "اي هي المواد اللي بتفتحها بروب تو" → postrequisite
        - "متطلبات Data Mining" → prerequisite
        - "اي مواد اختياري كلية" → Faculty Elective
        - "مواد إجباري برنامج" → Program Compulsory

        Return ONLY ONE label. No extra words.
        """

        try:
            result = self.llm.invoke(prompt).content.strip()
            print(f"[SubIntent Raw] LLM returned: {result}")

            allowed = {
                "prerequisite", "postrequisite", "blocked_courses",
                "course_description", "course_credits", "course_semester",
                "course_level", "course_list",
                "Program Elective", "Faculty Elective", "University Elective",
                "Program Compulsory", "Faculty Compulsory", "University Compulsory"
            }

            for item in allowed:
                if item.lower() in result.lower():
                    return item

            # Fallback logic based on keywords
            q_lower = query.lower()
            if any(word in q_lower for word in ["بتفتحها", "اللي بتفتح", "تفتحها", "لاحقة", "post", "unlock", "opened by"]):
                return "postrequisite"
            if any(word in q_lower for word in ["متطلب", "prerequisite", "قبل", "يشترط"]):
                return "prerequisite"
            if any(word in q_lower for word in ["اختياري كلية", "كلية اختياري"]):
                return "Faculty Elective"
            if any(word in q_lower for word in ["إجباري كلية", "كلية إجباري"]):
                return "Faculty Compulsory"

            return "course_description"

        except Exception as e:
            print(f"[Course SubIntent Error] {e}")
            return "course_description"
    def process_with_router_intent(self, query: str, router_intent: str = None, router_subintent: str = None) -> dict:
        print(f"🔀 [Router Override] Received: intent={router_intent}, subintent={router_subintent}")
        if router_intent == "courses":
            intent = "courses"
            course_subintent = router_subintent or self.classify_course_subintent(query)
        else:
            intent = self.classify_intent_academic(query)
            course_subintent = None
            if intent == "courses":
                course_subintent = self.classify_course_subintent(query)
        print(f"💡 [Pipeline Final] Intent: {intent} | SubIntent: {course_subintent}")
        context = self.get_smart_context(query, intent, course_subintent)
        return {
            "context": context,
            "question": query,
            "intent": intent,
            "course_subintent": course_subintent,
            "used_router_override": router_intent is not None
        }

    def get_smart_context(self, query: str, intent: str, course_subintent: str = None) -> str:
          print(f"Searching context using Hybrid EnsembleRetriever for intent: {intent}")
          searched_query = self.expand_query_to_english(query)
          code_in_query = re.search(r"02-24-\d+", query)

          if not self.vectordb or not self.ensemble_retriever:
              print("⚠️ [Warning] VectorDB or EnsembleRetriever is not fully configured yet.")
              return "سياق تجريبي: تأكد من ربط الـ VectorDB والـ Retriever الفعليين بمشروعك."

          # 🌟 خط الدفاع الذكي
          query_lower = query.lower()
          is_asking_about_course = any(w in query_lower for w in ["مادة", "ماده", "ساعة", "ساعه", "ساعات", "ترم", "ترم كام", "منهج", "كورس"])

          if is_asking_about_course:
              print("🔄 [Smart Correction] Overriding intent to 'courses' based on keywords!")
              intent = "courses"

          # ============================================================
          #  Elective / Compulsory
          # ============================================================
          metadata_mapping = {
              "Program Elective": ["برنامج اختياري", "اختياري برنامج", "Program Elective"],
              "Faculty Elective": ["كلية اختياري", "اختياري كلية", "Faculty Elective"],
              "University Elective": ["جامعة اختياري", "اختياري جامعة", "University Elective"],
              "Program Compulsory": ["برنامج إجباري", "إجباري برنامج", "Program Compulsory"],
              "Faculty Compulsory": ["كلية إجباري", "إجباري كلية", "Faculty Compulsory"],
              "University Compulsory": ["جامعة إجباري", "إجباري جامعة", "University Compulsory"],
          }

          if course_subintent in metadata_mapping:
              possible_values = metadata_mapping[course_subintent]
              print(f"🎯 [AI Dynamic Filter] Searching for: {possible_values}")

              docs = []
              search_keys = ["course_type", "type", "category", "TYPE", "section_type", "section"]

              for key in search_keys:
                  for val in possible_values:
                      try:
                          docs = self.vectordb.similarity_search(
                              searched_query,
                              k=25,
                              filter={key: val}
                          )
                          if docs:
                              print(f"✅ Found {len(docs)} docs with {key}={val}")
                              break
                      except Exception as e:
                          continue
                  if docs:
                      break

              if len(docs) < 4:
                  print("🔄 [Strong Content Fallback] Searching in page content...")
                  all_docs = self.vectordb.similarity_search(
                      searched_query + " إجباري OR اختياري OR ملخص",
                      k=30
                  )
                  docs = [
                      d for d in all_docs
                      if any(v.lower() in d.page_content.lower() for v in possible_values)
                  ]

                  if len(docs) < 3:
                      docs = [
                          d for d in all_docs
                          if any(word in d.page_content for word in ["اختياري", "إجباري"])
                      ]

              if not docs:
                  print("⚠️ [Final Fallback] Using general search")
                  docs = self.vectordb.similarity_search(searched_query, k=20)

              return "\n\n".join([doc.page_content for doc in docs[:15]])

          # ============================================================
          # 1️⃣ Prerequisite Chain
          # ============================================================
# ============================================================
          if intent == "courses" and course_subintent == "prerequisite":
              print("🔄 [Recursive Retrieval] Fetching full prerequisite chain chunks...")
              primary_docs = self.ensemble_retriever.invoke(searched_query)[:6]
              combined_content = [doc.page_content for doc in primary_docs]

              extracted_codes = []
              for doc in primary_docs:
                  matches = re.findall(r"02-24-\d+", doc.page_content)
                  extracted_codes.extend(matches)

              for code in list(set(extracted_codes))[:3]:
                  secondary_docs = self.vectordb.similarity_search(code, k=2)
                  for s_doc in secondary_docs:
                      if s_doc.page_content not in combined_content:
                          combined_content.append(s_doc.page_content)

              return "\n\n".join(combined_content)

     
         
# ============================================================
# 2️⃣ Course List (Study Plan) - الحل الجديد والأقوى
# ============================================================
          elif intent == "courses" and course_subintent == "course_list":
              has_year = any(w in query_lower for w in ["سنه", "سنة", "level", "year", "المستوى", "المستوي", "أولى", "ثانية", "ثالثة", "رابعة"])
              has_semester = any(w in query_lower for w in ["ترم", "تيرم", "semester", "الاول", "الأول", "التاني", "الثاني", "تاني", "ثاني"])

              if has_year and not has_semester:
                  print("❓ [Clarification Required] User asked for a full year without specifying the semester.")
                  return "NEED_SEMESTER_CLARIFICATION"

              print("📋 [Retrieval] Filtering Study Plan strictly...")
              docs = self.vectordb.similarity_search(
                  searched_query,
                  k=15,
                  filter={"section_type": "study_plan"}
              )
              if not docs:
                  docs = self.ensemble_retriever.invoke(searched_query)[:6]
              return "\n\n".join([doc.page_content for doc in docs])
          # ============================================================
          # 4️⃣ Course Code Search
          # ============================================================
          elif code_in_query:
              print(f" [Retrieval] Filtering strictly by Course Code: {code_in_query.group()}")
              docs = self.vectordb.similarity_search(
                  searched_query, k=5, filter={"course_code": code_in_query.group()}
              )
              return "\n\n".join([doc.page_content for doc in docs])

          # ============================================================
          # 5️⃣ General Rules
          # ============================================================
          elif intent == "general_rules":
              print(" [Retrieval] Filtering by Section: bylaws")
              docs = self.vectordb.similarity_search(
                  searched_query, k=10, filter={"section": "bylaws"}
              )
              if not docs:
                  docs = self.ensemble_retriever.invoke(searched_query)[:5]
              return "\n\n".join([doc.page_content for doc in docs])

          # ============================================================
          # 6️⃣ Final Fallback
          # ============================================================
          else:
              print(" [Retrieval] Fallback Search")
              docs = self.ensemble_retriever.invoke(searched_query)[:5]
              return "\n\n".join([doc.page_content for doc in docs])
    def full_pipeline(self, input_data: dict) -> dict:
        if isinstance(input_data, dict):
            question = input_data.get("question", "").strip()
            router_intent = input_data.get("router_intent")
            router_subintent = input_data.get("router_subintent")
        else:
            question = str(input_data).strip()
            router_intent = None
            router_subintent = None

        if not question:
            return {"context": "", "question": "", "intent": "general_rules"}

        if router_intent:
            return self.process_with_router_intent(question, router_intent, router_subintent)

        intent = self.classify_intent_academic(question)
        course_subintent = None
        if intent == "courses":
            course_subintent = self.classify_course_subintent(question)

        print(f"💡 [Pipeline] Intent: {intent} | SubIntent: {course_subintent}")
        context = self.get_smart_context(question, intent, course_subintent)
        return {
            "context": context,
            "question": question,
            "intent": intent,
            "course_subintent": course_subintent,
        }
    # ================= RAG CHAIN =================
    def build_chain(self, prompt):
        return (
            RunnableLambda(self.full_pipeline)
            | prompt
            | self.llm
            | StrOutputParser()
        )