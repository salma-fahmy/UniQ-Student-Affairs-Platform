import React, { useState } from 'react';
import { planGpa } from '../chatbotService';
import { FiTarget } from 'react-icons/fi';

const GpaPlanForm = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    current_gpa: '', target_gpa: '', completed_hours: '', remaining_hours: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: Number(e.target.value) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await planGpa(formData);
      if (res.possible) {
        let replyMsg = `🎯 خطتك للوصول لـ GPA المستهدف (${formData.target_gpa}):\n\nمطلوب منك تجيب متوسط معدل فصلي لا يقل عن **${res.required_avg_gpa}** في الساعات اللي باقية لك.\n\n`;
        if (res.min_grades && res.min_grades.length > 0) {
          replyMsg += `📋 توزيعة التقديرات المقترحة للمواد الجاية:\n`;
          res.min_grades.slice(0, 6).forEach((gradeItem) => {
             replyMsg += `• مادة من (${gradeItem.hours} ساعات) تجيب فيها: ${gradeItem.grade}\n`;
          });
          if(res.min_grades.length > 6) replyMsg += `• وباقي المواد على نفس النمط وبتقدير لا يقل عن ${res.min_grades[0].grade}.`;
        }
        onComplete(replyMsg);
      } else {
        onComplete(res.message || `عذراً، الحسابات بتقول إنه حسابياً صعب الوصول للمعدل المستهدف (${formData.target_gpa}) بناءً على الساعات المتبقية والمعدل الحالي للأسف 😔. حاول تظبط الهدف وخليه أقرب شوية.`);
      }
    } catch (error) {
      onComplete("حدث خطأ أثناء إعداد الخطة. يرجى مراجعة الأرقام والمحاولة مجدداً.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-[14.5px] font-medium text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(59,130,246,0.10)]";
  const labelClasses = "mb-1.5 ml-0.5 block text-[13px] font-bold text-slate-600 transition-colors duration-200";

  return (
    <div dir="rtl" className="flex h-full flex-col justify-between">
      <form onSubmit={handleSubmit} id="gpa-plan-form" className="space-y-4">
        <div className="flex items-center gap-2 rounded-2xl bg-indigo-50 p-3 text-[14px] font-semibold text-[#1e1b4b]">
          <FiTarget size={18} />
          دخل بياناتك الأكاديمية لرسم خطة للوصول لهدفك:
        </div>

        <div className="group flex flex-col">
          <label className={labelClasses}>الـ GPA الحالي (0 - 4)</label>
          <input name="current_gpa" type="number" step="0.01" min="0" max="4" placeholder="مثال: 3.2" onChange={handleChange} required className={inputClasses} />
        </div>

        <div className="group flex flex-col">
          <label className={labelClasses}>الـ GPA المستهدف (0 - 4)</label>
          <input name="target_gpa" type="number" step="0.01" min="0" max="4" placeholder="مثال: 3.5" onChange={handleChange} required className={inputClasses} />
        </div>
        
        <div className="flex gap-3">
          <div className="group flex flex-1 flex-col">
            <label className={labelClasses}>الساعات المجتازة</label>
            <input name="completed_hours" type="number" min="0" placeholder="مثال: 60" onChange={handleChange} required className={inputClasses} />
          </div>
          <div className="group flex flex-1 flex-col">
            <label className={labelClasses}>الساعات المتبقية</label>
            <input name="remaining_hours" type="number" min="0" placeholder="مثال: 64" onChange={handleChange} required className={inputClasses} />
          </div>
        </div>
      </form>

      <div className="mt-6 border-t border-slate-100 pt-4 bg-white sticky bottom-0 z-10">
        <button type="submit" form="gpa-plan-form" disabled={loading} className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#1e1b4b] px-5 py-3.5 text-[14px] font-medium text-white shadow-md transition-all duration-300 hover:bg-indigo-900 hover:shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">
          {loading ? 'جاري التحليل...' : 'اعرض خطة التارجت'}
        </button>
      </div>
    </div>
  );
};

export default GpaPlanForm;