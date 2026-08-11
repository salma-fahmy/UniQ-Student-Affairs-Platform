import React, { useState, useRef, useEffect } from 'react';
import { calculateGpa } from '../chatbotService';
import { FiPlus, FiTrash2, FiCpu, FiChevronDown, FiCheck } from 'react-icons/fi';

const CustomSelect = ({ value, options, onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const activeLabel = options.find((opt) => opt.value === value)?.label || value;

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-[46px] w-full items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-right shadow-sm transition-all duration-200 hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
      >
        <span className="min-w-0 truncate text-[14px] font-medium text-slate-800">
          {activeLabel}
        </span>
        <span className="grid shrink-0 place-items-center text-slate-400 transition-colors">
          <FiChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[105%] z-50 mt-1 w-full origin-top overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95 duration-200">
          <div className="max-h-48 overflow-y-auto p-1.5 smooth-scrollbar">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => { onChange(option.value); setIsOpen(false); }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-colors ${isSelected ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && <FiCheck size={14} className="shrink-0 text-blue-700" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const GpaCalculatorForm = ({ onComplete }) => {
  const [subjects, setSubjects] = useState([{ credit_hours: 3, grade: 'A' }]);
  const [loading, setLoading] = useState(false);

  const hoursOptions = [ { value: 3, label: '3 ساعات' }, { value: 2, label: 'ساعتين' } ];
  const gradesOptions = [
    { value: 'A+', label: 'A+' }, { value: 'A', label: 'A' }, { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' }, { value: 'B', label: 'B' }, { value: 'C+', label: 'C+' },
    { value: 'C', label: 'C' }, { value: 'D', label: 'D' }, { value: 'F', label: 'F' }
  ];

  const handleAddSubject = () => setSubjects([...subjects, { credit_hours: 3, grade: 'A' }]);
  const handleRemoveSubject = (index) => setSubjects(subjects.filter((_, i) => i !== index));
  const handleChange = (index, field, value) => {
    const newSubjects = [...subjects];
    newSubjects[index][field] = field === 'credit_hours' ? Number(value) : value;
    setSubjects(newSubjects);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await calculateGpa(subjects);
      const calculatedGpa = res.gpa || res.result || res; 
      onComplete(`الـ GPA المتوقع بناءً على المواد اللي دخلتها هو: **${calculatedGpa}** 🎉\nأتمنى لك ترم سعيد ومليان درجات عالية!`);
    } catch (error) {
      onComplete("للأسف حصلت مشكلة وأنا بحسب الـ GPA، يرجى مراجعة البيانات والمحاولة مرة تانية.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="flex h-full flex-col justify-between">
      <div>
        <div className="mb-4 flex items-center gap-2 rounded-2xl bg-indigo-50 p-3 text-[14px] font-semibold text-[#1e1b4b]">
          <FiCpu size={18} />
     قم بإضافة الساعات والتقدير الحاصل عليه لكل مادة:
        </div>

        <form onSubmit={handleSubmit} id="gpa-calc-form" className="space-y-3 pb-24">
          <div className="space-y-3">
            {subjects.map((sub, idx) => (
              <div key={idx} className="flex items-center gap-2 animate-in fade-in duration-200">
                <span className="text-xs font-bold text-slate-400 min-w-[20px]">{idx + 1}.</span>
                <div className="flex-1"><CustomSelect value={sub.credit_hours} options={hoursOptions} onChange={(val) => handleChange(idx, 'credit_hours', val)} /></div>
                <div className="flex-1"><CustomSelect value={sub.grade} options={gradesOptions} onChange={(val) => handleChange(idx, 'grade', val)} /></div>
                {subjects.length > 1 && (
                  <button type="button" onClick={() => handleRemoveSubject(idx)} className="flex shrink-0 items-center justify-center p-2 text-red-400 transition-colors hover:text-red-600">
                    <FiTrash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <button type="button" onClick={handleAddSubject} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 px-3 py-3.5 text-[13px] font-bold text-slate-600 transition-all hover:bg-slate-100 hover:text-[#1e1b4b] hover:border-[#1e1b4b]">
            <FiPlus size={16} /> إضافة مادة دراسية أخرى
          </button>
        </form>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-4 bg-white sticky bottom-0 z-10">
        <button type="submit" form="gpa-calc-form" disabled={loading} className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#1e1b4b] px-5 py-3.5 text-[14px] font-medium text-white shadow-md transition-all duration-300 hover:bg-indigo-900 hover:shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">
          {loading ? 'جاري الحساب...' : 'احسب المعدل واعرض النتيجة'}
        </button>
      </div>
    </div>
  );
};

export default GpaCalculatorForm;