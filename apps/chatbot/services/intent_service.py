import torch
import torch.nn.functional as F
import json
import numpy as np  
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from arabert.preprocess import ArabertPreprocessor


class IntentService:

    def __init__(
        self,
        intent_llm=None,     
        intents=None,
        llm_model=None       
    ):
        self.llm = llm_model
        self.intent_llm = intent_llm 
        self.intents = intents if intents is not None else []
        self.valid_intents = {"general_query", "gpa_calc", "gpa_plan", "course_rec"}
        
    # =========================
    def detect_topic_shift(self, current_query, chat_history):
        if not chat_history:
            return "NEW"

        if self.llm is None:
            return "SAME"

        last_msgs = chat_history[-5:]
        context_list = []

        for m in last_msgs:
            role = "user" if (hasattr(m, 'type') and m.type == 'human') else "assistant"
            content = m.content if hasattr(m, 'content') else str(m)
            context_list.append(f"{role}: {content}")

        context = "\n".join(context_list)

        prompt = f"""
        You are an ELITE, ZERO-TOLERANCE Conversation Flow Detector for a College Academic Advisor Bot.
        Your SOLE mission is to classify the relationship between the "Current Question" and the "Context" as either SAME or NEW.
        --- CRITICAL CLASSIFICATION RULES ---
        [SAME] - SCENARIO (Strict Definition):
        1. PRONOUN/CONTEXT DEPENDENCY (CRITICAL): The current question cannot be understood on its own. It relies entirely on the previous context due to implicit references, relative nouns, or connected pronouns in Egyptian Arabic/English (e.g., "بتاعه", "فيها", "منها", "متطلباتها", "هو بكام؟", "طب وايه متطلباتها؟"). If a stranger cannot understand what the question is referring to without looking at the context, it is strictly SAME.
        2. CONTEXTUAL CONTINUATION (THE LINGUISTIC FRAGMENT / MULTIPLE CHOICE PATTERN): The user is continuing the exact same intent but appending, modifying, or adding a new entity/option to a previous choice, comparison, or list. This includes cases where the current question is a linguistic fragment (like starting with an alternative conjunction or disjunctive particle) that organically completes the structure of the previous context.
        3. DIRECT FOLLOW-UP / CLARIFICATION: Asking for more details, status, execution, comparisons, or clarifications about the exact entities or information just provided in the context (e.g., Context: Explaining GPA, Current: "الكلية شغالة بالنظام بتاعه ولا لأ؟" or "هو بيتأثر بالغياب؟").
        4. CONVERSATIONAL RESPONSE / DIALOGUE ANSWER: If the current input is a direct response, answer, or polite feedback to a question/statement made by the bot in the context (e.g., Bot asks/says something friendly, and the user answers: "انا الحمد لله", "تمام شكرا", "تسلم"). This is a direct continuation of the immediate dialogue flow, so it is strictly SAME.
        [NEW] - SCENARIO (Strict Definition):
        1. INDEPENDENT QUESTION WITH NEW INTENT: If the current question asks about a completely different topic, action, or intent than the context, and stands completely on its own, it is "NEW".
        2. INTENT SHIFT (CRITICAL): If the context and current question both explicitly name courses, but the core question shifts from "Recommendation/Comparison" (e.g., "اسجل ايه؟", "انهي اسهل؟") to independent "Administrative/Bylaw Rules" (e.g., "بكام اللائحة؟"), and contains NO pronoun dependency, this is strictly a NEW topic.
        3. COMPLETE INDEPENDENCE: If the current question can be read and fully understood by a stranger without looking at the context, AND it introduces a brand new independent topic without any continuous flow or linguistic references, it is "NEW".
        4. GARBAGE / RANDOM INPUT (CRITICAL): If the current question consists of random gibberish, keyboard mashes, typos that form completely meaningless words (e.g., "لرتاى ن", "خهلراءة", "ءسشيب", "asdfgh"), or symbols that make absolutely no linguistic sense, you MUST classify it as NEW. It has ZERO relation to the previous context.
        5. INDEPENDENT SERVICE OR DOCUMENT SHIFT (CRITICAL): If the context is about a specific service or document (e.g., "ورقة التخرج") and the current question explicitly introduces a completely different independent document, service, or administrative process (e.g., "ورق التقديم في الكلية") with its own clear question word (e.g., "إيه", "ازاي"), you MUST classify it as NEW. Shifting between different administrative services or independent documents means a brand new RAG intent is required, which overrides any generic contextual similarity unless there is a strict pronoun dependency.
        --- GOLDEN GUARDRAILS ---
        * FULL STANDALONE QUESTION OVERRIDE: If the Current Question is a fully structured, independent academic/administrative question that introduces a completely new topic with all its entities explicitly mentioned (e.g., Context is about "ورق التقديم", Current is "هو ينفع اسجل 18 ساعة in the term?"), you MUST output NEW.
        * DIALOGUE RESPONSE OVERRIDE: If the current input is a direct conversational response or a phrase answering the bot's previous turn (like "انا الحمد لله" answering "وانت كويس؟"), it is deeply tied to the ongoing conversational thread. You MUST output SAME.
        * GARBAGE OVERRIDE: If the Current Question is completely unreadable, nonsensical, or contains only random letters/symbols, this completely overrides any similarity logic. You MUST output NEW. Do NOT try to inherit context or assume it is a continuation.
        * CONJUNCTION & FRAGMENT OVERRIDE: If the Current Question is a linguistic fragment that begins with an alternative conjunction, disjunctive connector, or comparison particle in any language, indicating it is adding an alternative option to the context, it strictly relies on that context. You MUST output SAME.
        * PRONOUN OVERRIDE: If the current question contains ANY pronoun, suffix pronoun, or reference (like "بتاعه", "دي", "هناك", "معاها") that directly links to the context's main subject, this OVERRIDES any intent shift. You MUST output SAME.
        * DO NOT match "SAME" just because the user mentions a course name. The core intent/question type must also be a continuation of the context.
        * If the Context is about choosing/comparing courses (e.g., "اسجل x ولا y") and the Current Question asks about requirements/prerequisites of a completely separate course without pronoun dependency (e.g., "هو ايه متطلبات داتا بيز"), you MUST output NEW.
        * If the user uses conversational transitions like "طب ومادة...", "طب و...", "What about..." to apply the EXACT SAME previous question logic to a new subject, output SAME.
        Context:
        {context}
        Current Question:
        {current_query}
        Answer ONLY with one of these exact strings (No explanation, no markdown punctuation):
        SAME
        NEW
        """
        try:
            response = self.llm.invoke(prompt)

            raw_output = response.content
            cleaned_output = raw_output.strip().upper()

            print("\n🧪 [TOPIC SHIFT RAW OUTPUT]")
            print(f"RAW: >>>{raw_output}<<<")
            print(f"CLEANED: >>>{cleaned_output}<<<\n")

            return cleaned_output

        except Exception as e:
            print(f"❌ Topic Shift Error: {e}")
            return "SAME"

    # =========================
    def rewrite_query(self, query: str, chat_history: list) -> str:
        """
        Advanced context injection engine that completes short/implicit user queries 
        using recent history (Both Student & Assistant turns), maintaining strict academic metrics.
        Optimized for Hybrid-RAG router and Academic Chain Classifier.
        """
       
        if not chat_history or self.llm is None:
            return query

        last_msgs = []
        for m in chat_history[-4:]:
            if hasattr(m, 'type'):
                role = "Student" if m.type == 'human' else "Assistant_Bot"
            else:
                role = "Student" if "human" in str(type(m)).lower() else "Assistant_Bot"
                
            content = m.content if hasattr(m, 'content') else str(m)
            last_msgs.append(f"{role}: {content}")

        context = "\n".join(last_msgs)

        prompt = f"""You are a precise Arabic query translation and context injection engine for a college Academic Advisor Bot.
Your ONLY task is to output a clean, standalone question in Egyptian dialect based on the 'Current User Question' and 'Conversation Context' (which includes Student queries and Assistant_Bot answers).

CRITICAL REWRITE LOGIC (STRICTLY ENFORCED):
0. **ABSOLUTE PROTECTION OF MEANING (HIGHEST PRIORITY — OVERRIDES ALL RULES BELOW)**:
   A rewrite is ONLY allowed if the 'Current User Question' is genuinely ambiguous or incomplete WITHOUT the conversation context.
   Before rewriting ANYTHING, ask: "If I send this question alone to someone who never saw this conversation, will they fully understand what is being asked?"
   - If YES → Output the question EXACTLY AS-IS. Do NOT rephrase, inject context, or change a single word. Keep the exact core meaning, tone, and gender.
   - If NO → Apply rules 1–12 below to resolve the ambiguity using context.
   The rewrite must ONLY resolve ambiguity. It must NEVER change the core meaning, intent, or phrasing of the question.
   A rewrite that changes what the student is asking — even slightly — is a FAILED rewrite.

1. **STRICT CONJUNCTION & CHOICE INHERITANCE**:
   If the 'Current User Question' starts with choice/alternative words like ("ولا...", "أو...", "طب ومادة...") and the previous Student query was a choice or comparison between courses (e.g., "اسجل مادة x ولا مادة y"), you MUST inherit the exact same action (Comparison/Recommendation). Do NOT fetch old intents like "متطلبات" or "بكام" from earlier history.

2. **STRICT PRONOUN & CO-REFERENCE RESOLUTION (ANY HISTORY)**:
   If the 'Current User Question' uses pronouns or ambiguous references (e.g., "هو عبارة عن ايه", "ده بيتأثر ازاي", "الكلمة دي", "الموضوع ده") that refer to a subject mentioned ANYWHERE in the recent history (whether in the Student's previous query or the Assistant_Bot's answer), you MUST replace the pronoun or inject the exact Entity name (e.g., If the previous entity was "الـ gpa", the output MUST be: "طب تعرف ال gpa عباره عن ايه").

3. **STRICT ENTITY OVERWRITE (EXCEPT IN COMPARISONS)**:
   If the user changes their specific course name, code, or entity (e.g., switching from "داتا بيز" to "داتا استراكتشر") in a continuous single-subject question, you MUST COMPLETELY DROP the old entity. Never keep or mix the old course name if a new one is mentioned.
   EXCEPTION: If the user is listing choices or expanding an ongoing comparison (e.g., using "ولا...", "أو..."), you MUST ACCUMULATE and keep ALL previously mentioned courses in that specific comparison context.

4. **NO INTENT BLENDING / NO FILLER**:
   The NEW intent/action must completely REPLACE the old one. Do NOT combine or blend conflicting intents. If the user asks "بتفتح مواد ايه", the output should ONLY ask about unlocking courses, NOT mix it with requirements or previous actions.

5. **STRICT USER CORRECTION COMPLIANCE**:
   If the student explicitly corrects a word or action (e.g., "لا تسجيل مش سحب"), you MUST immediately drop the wrong action (سحب) and strictly apply the student's corrected action (تسجيل) in the final output.

6. **PRESERVE THE EXACT QUESTION WORD**:
   Never alter or change the student's primary core metric or question intent. If they ask "بكام", "قد ايه" or "يعني كام" (asking for price/value), the output MUST maintain that exact core question word. Do NOT change a price query into a general definition query ("يعني ايه").

7. **STRICT CONFIRMATION & EXCLAMATION INJECTION**:
   If the 'Current User Question' is a short confirmation check or exclamation (e.g., "انت متأكد؟", "بجد؟", "متأكد؟"), you MUST inject the main subject from the previous conversation. Do NOT output it blindly as-is, and do NOT phrase it as "متأكد من ايه". Instead, bind it cleanly to the active topic (e.g., If previous topic was "تأثير ايقاف القيد", the output MUST be: "انت متأكد من تأثير ايقاف القيد عليا؟"). 
   - ONLY return the query EXACTLY AS-IS if it is a pure conversational filler with zero academic weight (e.g., "تمام شكرا", "مش فاهمه قصدك").

8. **STRICT SUBJECT SHIFT & NO CONTEXT INJECTION FOR STANDALONE QUERIES**:
   If the 'Current User Question' is independent, complete, and fully understandable on its own without relying on any previous context or the Assistant_Bot's last answer (e.g., asking "هو التخرج من كام ساعة" or "ممكن اتخرج في 3 سنين ولا لا"):
   - You MUST COMPLETELY DROP all previous context, rules, constraints (like "بكام" or "التكلفة"), and earlier intents.
   - Output the question cleanly as-is without embedding any historical artifacts.

9. **STRICT LANGUAGE AND ENTITY PRESERVATION**:
   Do NOT translate, alter, or transliterate any course names, nouns, or specific entities. Keep them exactly in the language they were entered by the user (Arabic stays Arabic, English stays English).

10. **STRICT INTENT REPLACEMENT & ENTITY DROPPING ON TOPIC SHIFT**:
    If the 'Current User Question' shifts from asking about a specific service/document/course to asking a general procedural question about actions like filing a complaint ("اقدم شكوى ايه"), protesting, or modifying an action because a request wasn't executed, you MUST COMPLETELY DROP the specific old service/document name (e.g., do NOT inject specific names like "اثبات القيد" or specific course names). Instead, keep the query focused purely on the new action/complaint intent regarding general requests (e.g., "لو قدمت على طلب ومتعملش اقدم شكوى ايه"). Injecting old specific entities into new generalized actions is strictly prohibited as it biases embedding classifiers.

11. **STRICT INTENT/ACTION ISOLATION AND CLEAN SPECIFIC BINDING (GENERALIZED FIX)**:
    When extracting historical context to resolve an ambiguous current question, you MUST isolate the core Subject/Entity (e.g., "ايقاف القيد", "مادة داتا بيز") from the previous Question Intent/Action word (e.g., "خطوات", "شروط", "ازاي اقدم"). 
    - If the student's current question introduces a brand new action or asks about implications/effects (e.g., "ده ممكن يأثر عليا ازاي", "ايه تأثير ده"), you are STRICTLY PROHIBITED from carrying over or blending the old action words (like "خطوات"). 
    - You must output a clean phrase binding ONLY the core subject to the new intent. (For example: instead of blending into "تأثير خطوات ايقاف القيد", isolate it cleanly to "ايه تأثير ايقاف القيد عليا" or "ايقاف القيد ممكن يأثر على عليا ازاي").

12. **STRICT GENDER AND DIALECT PRESERVATION**:
    You MUST preserve the exact grammatical gender used by the student. If the student uses a feminine form (e.g., "جايبه", "عايزه", "كنت عامله"), the rewritten output MUST remain strictly feminine. Do NOT alter the gender to masculine (e.g., do NOT change "جايبه" to "جايب"). Maintain the exact Egyptian slang flavor.

FEW-SHOT EXAMPLES FOR TRAINING & CORRECTION:
- Conversation Context:
  Student: تعرف تحسبلي ال gpa
  Assistant_Bot: طبعاً، قولي درجاتك وساعات المواد كام وأنا أحسبهالك فوراً.
  Current User Question: طب تعرف هو عباره عن ايه
  Standalone Question: طب تعرف ال gpa عباره عن ايه

- Conversation Context:
  Student: هو ايه تأثير ايقاف القيد عليا
  Assistant_Bot: إيقاف القيد بيأجل دراستك ومبيتحسبش من سنوات الرسوب بس هيأخر تخرجك ترم أو سنة.
  Current User Question: انت متأكد ؟
  Standalone Question: انت متأكد من تأثير ايقاف القيد عليا؟

- Conversation Context:
  Student: بقولك اسجل داتا بيز ولا داتا استراكتشر
  Assistant_Bot: يفضل تسجيل داتا بيز أولاً لو مهتم بالأنظمة، أو داتا استراكتشر لو عايز تقوي البرمجة.
  Current User Question: وللا بروجرامينج 1؟
  Standalone Question: اسجل داتا بيز ولا داتا استراكتشر ولا بروجرامينج 1

- Conversation Context:
  Student: هو ممكن تقولي ايه الاحسن داتا بيز ولا داتا استراكتشر
  Assistant_Bot: داتا استراكتشر أفضل لتطوير مهارات حل المشكلات، وداتا بيز أفضل لتصميم الأنظمة.
  Current User Question: ولا بيج داتا
  Standalone Question: ايه الاحسن داتا بيز ولا داتا استراكتشر ولا بيج داتا

- Conversation Context:
  Student: هو ايه متطلبات مادة داتا بيز
  Assistant_Bot: متطلبات داتا بيز هي مادة هيكلة البيانات.
  Current User Question: طب وداتا استراكتشر؟
  Standalone Question: ايه متطلبات مادة داتا استراكتشر

- Conversation Context:
  Student: ايه متطلبات مادة داتا بيز
  Current User Question: تعرف اي بتفتح مواد ايه طيب؟
  Standalone Question: ايه المواد اللي بتفتحها مادة داتا بيز

- Conversation Context:
  Student: ازاي اسجل مادة داتا بيز ورقي
  Assistant_Bot: عشان تسحب المادة لازم تروح الشؤون.
  Current User Question: لا تسجيل مش سحب
  Standalone Question: ازاي اسجل مادة داتا بيز ورقي

- Conversation Context:
  Student: هو ايه خطوات ايقاف القيد
  Assistant_Bot: الخطوات تشمل تقديم طلب ورفع الأوراق وقد يتطلب سداد رسوم إدارية.
  Current User Question: الرسوم دي قد اي؟
  Standalone Question: رسوم ايقاف القيد قد اي

- Conversation Context:
  Student: مش فاهمه قصدك
  Assistant_Bot: للأقسام الخاصة الرسوم تعادل سعر 6 ساعات معتمدة.
  Current User Question: قصدي ال 6 ساعات دول يعني كام?
  Standalone Question: ال 6 ساعات بتوع ايقاف القيد للأقسام الخاصة يعني كام

- Conversation Context:
  Student: طب تعرف بكام
  Assistant_Bot: رسوم ايقاف القيد هي كذا جنيه.
  Current User Question: طب بقولك هو ممكن تحسبلي ال gpa
  Standalone Question: طب بقولك هو ممكن تحسبلي ال gpa

- Conversation Context:
  Student: عايزه احسب ال gpa بتاعي
  Assistant_Bot: تفضلي، محتاجة تدخلي الساعات والدرجات.
  Current User Question: ممكن تحسبلي ال gpa تاني
  Standalone Question: ممكن تحسبلي ال gpa تاني

STRICT RULES:
- Do NOT answer, explain, or summarize.
- Do NOT use markdown, quotes, or backticks in the final output.
- Output ONLY the final coherent standalone question in one sentence in Egyptian dialect.

Conversation Context:
{context}

Current User Question:
{query}

Rewritten Standalone Question:"""

        try:
            response = self.llm.invoke(prompt)
            refined_output = response.content.strip()
            
            refined_output = refined_output.strip('"\'`-\\u200f\\u200e')
            
            return refined_output if refined_output else query
        except Exception as e:
            print(f"⚠️ [Query Rewrite Error] {e}")
            return query
    # =========================
    # CLASSIFY INTENT 
    # =========================
    def classify_intent(self, text, threshold=0.85):
        
        classification_model = self.intent_llm or self.llm

        if classification_model is None:
            print("❌ Error: No LLM model provided for classification!")
            return "general_query", 0.0

       
        groq_system_prompt = """You are a strict, logical intent classification engine for a university academic assistant.
Your ONLY task is to output exactly ONE label: general_query, gpa_calc, gpa_plan, or course_rec.

---

### THE GOLDEN FACT VS. ACTION RULE

1. general_query
- DEFINITION: Factual information, static rules from bylaws, eligibility checks, policy questions, course prerequisites, course dependency chains (what opens/locks what), or explanations — even if numbers or future goals appear. Also includes any out-of-scope queries, small talk, or general non-academic questions.
- HARD RULES:
  * Out-of-scope topics, off-topic questions, tech hardware, or small talk (e.g., "ايه رايك في لابتوب ديل", "الجو عامل ايه اليومين دول", "ازيك") ➔ general_query
  * Grade point values (e.g., "A كام point") ➔ general_query
  * Explaining how a specific grade (like F, W, D) affects or impacts the GPA ➔ general_query
  * Course dependency chains / Academic failure impacts (e.g., "لو سقطت في مادة ايه هيقفل؟", "المواد المعتمدة على الـ AI") ➔ general_query
  * Plain course lists (e.g., "مواد سنة اولى") ➔ general_query
  * Course information, rules, or prerequisites (e.g., "متطلبات مادة كذا", "شروط فتح المادة", "المادة دي بتتكلم عن ايه") ➔ general_query
  * GPA formulas / how GPA works ➔ general_query
  * Comparing departments or programs ➔ general_query
  * Gibberish, insults, single words ➔ general_query
  * Checking if a GPA value meets a condition (e.g., "2.5 يعمل مرتبة شرف؟") ➔ general_query
  * Questions about graduation requirements or timeline rules ➔ general_query
  * Asking whether an action is ALLOWED (e.g., "Can I register X", "هل يجوز Y") ➔ general_query
  * Asking about registration rules or academic policies ➔ general_query

2. gpa_calc
- DEFINITION: When the user requests an actual arithmetic computation of their GPA, OR explicitly commands the bot to execute the calculation function rather than just explaining the rules.
- CRITICAL DISTINCTION:
  * "لو جبت 2.5 هيبقى ليا مرتبة شرف؟" ➔ general_query (checking a condition)
  * "عندي A و B و C احسبلي التراكمي" ➔ gpa_calc (providing grades, requesting computation)
  * "لا انا عايزاك تحسبه مش تقولي الطريقه" or "احسبهولي انت" ➔ gpa_calc (Explicit command to perform the action/tool execution, relying on context grades)
  * THE TEST: Is the user asking HOW to calculate or checking a rule? ➔ general_query
                 Is the user explicitly demanding the system to EXECUTE the calculation right now? ➔ gpa_calc

3. course_rec
- DEFINITION: ONLY when the user asks for a subjective OPINION, EVALUATION, preference, or RECOMMENDATION on WHICH courses to choose, prefer, or register among alternatives.
- THE ABSOLUTE BOUNDARY RULE: 
  * It MUST explicitly involve an academic choice, comparison, or recommendation request between university courses or tracks (e.g., "ايه احسن مادة اختيارية", "اسجل X ولا Y").
  * Non-academic opinions or off-topic product recommendations (e.g., "رأيك في لابتوب ديل") are strictly OUT OF SCOPE and MUST be classified as `general_query`.
  * Asking about static facts of the curriculum—such as which courses get locked, unlocked, or blocked due to failing a prerequisite—is strictly a bylaw fact check and MUST be classified as `general_query`.

4. gpa_plan
- DEFINITION: ONLY for a strategic plan, future projections, or checking the feasibility/possibility of reaching a specific TARGET GPA number OR a specific TARGET academic grade/standing (like "امتياز", "جيد جداً") from a current starting point.
- MUST involve a numeric GPA target, an improvement goal, or an explicit question about the ability/possibility to reach a specific grade tier or higher cumulative score (e.g., moving from 3.5 to 3.6, or asking "ممكن اوصل لـ X ولا لا").
- EXAMPLES:
  * "اوصل 3.5 ازاي" ➔ gpa_plan
  * "لو جايب 3.5 ممكن اوصل ل 3.6 ولا لا" ➔ gpa_plan
  * "طب ممكن اعرف انا اقدر اوصل لامتياز ولا لا" ➔ gpa_plan
  * "محتاج اعمل ايه عشان اوصل للتارجت" ➔ gpa_plan (only if a GPA/Grade target is mentioned)
  * "اعمل ايه لو عايز اتخرج في 3 سنين" ➔ general_query (graduation policy, NOT GPA strategy)
  * "I want to graduate in 3 years" ➔ general_query (timeline/policy question)

---

### FALSE POSITIVE TRAPS

| User says... | Looks like... | Actually is... |
|---|---|---|
| "لو جبت 2.5 هيبقى ليا مرتبة شرف؟" | gpa_calc / gpa_plan | general_query (static rule check, no improvement target) |
| "كيف يؤثر تقدير F على معدل GPA" | gpa_calc | general_query (bylaw mechanism/explanation) |
| "تعرف بتأثر ازاي على ال gpa" | gpa_calc | general_query (bylaw mechanism/explanation) |
| "Can I register a summer course" | course_rec | general_query (eligibility check) |
| "اعمل ايه لو عايز اتخرج في 3 سنين" | gpa_plan | general_query (graduation policy) |
| "I want to graduate in 3 years" | gpa_plan | general_query (timeline policy) |
| "هل يجوز اسجل مادتين صيفي" | course_rec | general_query (policy/rule) |
| "A عباره عن كام point؟" | gpa_calc | general_query (bylaw fact) |
| "2.5 كافيه للتخرج؟" | gpa_calc | general_query (condition check) |
| "لا انا عايزاك تحسبه مش تقولي الطريقه" | general_query | gpa_calc (action execution command) |
| "احسبهولي انت مش هشرح" | general_query | gpa_calc (action execution command) |
| "ايه متطلبات مادة الداتا بيز" | course_rec | general_query (bylaw/prerequisite fact - NO choice/recommendation) |
| "المادة دي بتفتح مادة ايه" | course_rec | general_query (bylaw/prerequisite fact - NO choice/recommendation) |
| "لو سقطت في مادة الـ AI ايه المواد اللي هتتقفلي" | course_rec | general_query (Bylaw dependency chain/Impact of failure - NO recommendation) |
| "شروط فتح مادة الألجوريزم" | course_rec | general_query (academic policy - NO choice/recommendation) |
| "ايه رايك في لابتوب ديل" | course_rec | general_query (out of scope / off-topic tech query) |
| "ما هي شروط الحصول على تقدير امتياز" | gpa_plan | general_query (asking for static rules/bylaw criteria, not a personal path) |

---

### THE FOUR DECISION TESTS (apply in order)

1. Is the user providing grades OR explicitly demanding the system to perform/execute the actual GPA calculation? → gpa_calc
2. Is the user explicitly asking for an academic opinion, ranking, comparison, or advisor recommendation on WHICH university courses/tracks to pick/prefer? (Note: General tech advice, off-topic opinions, prerequisite blocks, or course facts are NOT course recommendations) → course_rec
3. Is the user asking for a strategy, plan, or checking their capability/possibility to reach a specific numeric GPA target or an overall cumulative grade tier (e.g., "امتياز", "جيد جدا", or raising GPA from X to Y)? → gpa_plan
4. Everything else (facts, rules, policies, eligibility, timelines, course requirements/prerequisites, out-of-scope topics, general questions, small talk) → general_query

---

### DIRECT PATTERN MATCHING
- "A عباره عن كام point" ➔ general_query
- "كيف يؤثر تقدير F على ال gpa" ➔ general_query
- "احسب ال gpa ازاي" / "قانون ال gpa" ➔ general_query
- "ايه المواد الاختياريه" ➔ general_query
- "ايه متطلبات مادة الـ AI" ➔ general_query
- "مادة الألجوريزم شروطها ايه" ➔ general_query
- "لو سقطت في مادة ai اي المواد اللي هتتقفلي" ➔ general_query
- "ايه احسن مواد اختياريه" ➔ course_rec
- "اسجل داتا بيز ولا استراكتشر" ➔ course_rec
- "الخاص احسن ولا العام" ➔ general_query
- "لو جبت 2.5 هيبقى ليا مرتبة شرف ولا لا" ➔ general_query
- "ممكن تحسبهولي" + grades provided ➔ gpa_calc
- "لا انا عايزاك تحسبه مش تقولي الطريقه" ➔ gpa_calc
- "احسبهولي انت" ➔ gpa_calc
- "اعمل ايه لو عايز اتخرج في 3 سنين" ➔ general_query
- "I want to graduate in 3 years" ➔ general_query
- "Can I register a summer course" ➔ general_query
- "اوصل 3.5 ازاي" ➔ gpa_plan
- "لو جايب 3.5 ممكن اوصل ل 3.6 ولا لا" ➔ gpa_plan
- "هو انا لو جايب 3.5 ممكن اوصل ل 3.6" ➔ gpa_plan
- "طب ممكن اعرف انا اقدر اوصل لامتياز ولا لا" ➔ gpa_plan
- "عايز اجيب جيد جدا ارفع التراكمي ازاي" ➔ gpa_plan
- "ايه رايك في لابتوب ديل" ➔ general_query
- "صباح الخير وازيك" ➔ general_query

---

### OUTPUT RULE
Reply with ONLY the single label name. No explanation, no punctuation, no markdown formatting.
"""
        try:
       
            messages = [
                ("system", groq_system_prompt),
                ("user", f"Classify this message:\n{text}")
            ]
            
    
            response = classification_model.invoke(messages)
            predicted_label = response.content.strip()
          
            predicted_label = predicted_label.replace("`", "").replace("'", "").replace('"', '').strip()

            if predicted_label not in self.valid_intents:
                predicted_label = "general_query"

            print(f"\n--- [Groq LLM Pure Classification] ---")
            print(f"📥 Raw Input: {text}")
            print(f"🤖 Prediction: {predicted_label}\n")

            return predicted_label, 1.0

        except Exception as e:
            print(f"❌ Error during Groq Pure Classification: {e} → Fallback to general_query")
            return "general_query", 0.0