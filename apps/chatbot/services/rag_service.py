import json
import numpy as np
from sentence_transformers import SentenceTransformer, util

class RAGService:
    def __init__(self, data_path="data/data.json", model_name="intfloat/multilingual-e5-base"):
      
        with open(data_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        self.intents = data if isinstance(data, list) else data["intents"]

        # embedding model
        self.embed_model = SentenceTransformer(model_name)

        # build embeddings 
        self.texts = [self.build_intent_text(i) for i in self.intents]
        
        print("[INFO] Building embeddings for intents...")
        self.embeddings = self.embed_model.encode(
            ["passage: " + t for t in self.texts], 
            normalize_embeddings=True,
            show_progress_bar=True
        )

    # ==========================================
    # TEXT BUILDER 
    # ==========================================
    def build_intent_text(self, intent):
     
        when_to_use_str = " أو ".join(intent.get('when_to_use', [])) if intent.get('when_to_use') else "غير محدد"
        example_queries_str = " . ".join(intent.get('example_queries', [])) if intent.get('example_queries') else "غير محدد"
        keywords_str = " ، ".join(intent.get('keywords', [])) if intent.get('keywords') else "غير محدد"
        required_info_str = " ، ".join(intent.get('required_info', [])) if intent.get('required_info') else "لا توجد مستندات أو معلومات مطلوبة"
        
        steps_before_str = " ثم ".join(intent.get('steps_before', [])) if intent.get('steps_before') else "غير محدد"
        steps_after_str = " ثم ".join(intent.get('steps_after', [])) if intent.get('steps_after') else "غير محدد"
        
        entry_action = intent.get('entry_action', {})
        entry_action_str = f"الزر المخصص للخدمة هو '{entry_action.get('text', '')}' والمسار أو الرابط الداخلي هو '{entry_action.get('route', '')}'" if entry_action else "لا يوجد مسار محدد"

        rules_str = " . ".join(intent.get('rules', [])) if intent.get('rules') else "لا توجد شروط خاصة"

        return (
            f"اسم الخدمة أو الطلب الأكاديمي: {intent.get('request_name')}.\n"
            f"تصنيف أو فئة الخدمة: {intent.get('category')}.\n"
            f"الوصف التفصيلي والكامل للخدمة: {intent.get('description')}.\n"
            f"متى يتم استخدام هذا الطلب والحالات المناسبة له: {when_to_use_str}.\n"
            f"الكلمات الدلالية والمفتاحية المرتبطة بالإجراء: {keywords_str}.\n"
            f"طريقة سؤال الطلاب واعتراضاتهم عن الخدمة: {example_queries_str}.\n"
            f"المعلومات والأوراق والشهادات المطلوبة لإتمام الإجراء: {required_info_str}.\n"
            f"الخطوات التمهيدية قبل فتح الاستمارة: {steps_before_str}.\n"
            f"إجراء الدخول والروابط المباشرة: {entry_action_str}.\n"
            f"الخطوات النهائية بعد فتح الاستمارة والدفع: {steps_after_str}.\n"
            f"القواعد والشروط القانونية والتنظيمية: {rules_str}."
        )

    # ==========================================
    # RETRIEVAL WITH SCORE + DEBUGGING SYSTEM
    # ==========================================
    def retrieve_with_score(self, query, top_k=1, threshold=0.60, allowed_fields="all"):
        """بيرجع النتائج مع الـ confidence score مع طباعة تقرير ديباجنج متكامل"""
        
        query_vec = self.embed_model.encode("query: " + query, normalize_embeddings=True)
        
        scores = np.dot(self.embeddings, query_vec)
        
        all_ranked_idx = np.argsort(scores)[::-1]
        ranked_idx = all_ranked_idx[:top_k]
        
        # ----------------------------------------------------
        #  Debugging 
        # ----------------------------------------------------
        print("\n" + "="*80)
        print(f"🔍 DEBUG REPORT FOR QUERY: '{query}'")
        print("="*80)
        print("Top 5 Matched Intents (with scores):")
        
        for rank, idx in enumerate(all_ranked_idx[:5], 1):
            intent = self.intents[idx]
            print(f" {rank}. ID: [{intent.get('request_id')}] | Name: '{intent.get('request_name')}' | Score: {scores[idx]:.4f}")
        
        print("="*80 + "\n")
        # ----------------------------------------------------

        results = []
        for i in ranked_idx:
            intent_data = self.intents[i]

            if allowed_fields == "all":
                safe_intent = intent_data
            else:
                safe_intent = {
                    k: v
                    for k, v in intent_data.items()
                    if k in allowed_fields
                }

            results.append({
                "intent": safe_intent,
                "score": float(scores[i])
            })
        
        best_score = results[0]["score"] if results else 0
        is_confident = best_score >= threshold
        
        return results, best_score, is_confident