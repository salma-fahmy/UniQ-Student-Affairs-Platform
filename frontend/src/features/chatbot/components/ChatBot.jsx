import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FiX, FiMinus, FiMaximize2, FiMinimize2, FiArrowRight, FiArrowUp } from 'react-icons/fi';
import { TbMessageChatbot } from 'react-icons/tb';
import { BsChatSquareDots } from "react-icons/bs";
// import { RiRobot2Line } from "react-icons/ri";
import ReactMarkdown from 'react-markdown';
import { sendChatMessage } from '../chatbotService';
import GpaCalculatorForm from './GpaCalculatorForm';
import GpaPlanForm from './GpaPlanForm';

import useAuth from '../../auth/useAuth'; 

const IconFab = () => <BsChatSquareDots size={26} />;
const IconHeader = () => <TbMessageChatbot size={20} />;
const IconAvatar = () => <TbMessageChatbot size={16} />;

const SUGGESTION_CHIPS = ['عايز احسب الـ GPA', 'تخطيط الـ GPA المستهدف', 'ايه شروط التسجيل؟'];

const BotAvatar = () => (
  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm">
    <IconAvatar />
  </div>
);

const TypingDots = () => (
  <div className="flex h-[22px] items-center gap-1.5 py-0.5">
    {[0, 1, 2].map((i) => (
      <span 
        key={i} 
        className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400"
        style={{ animationDelay: `${i * 0.15}s` }} 
      />
    ))}
  </div>
);

const MessageRow = ({ message }) => {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="mb-5 flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-200" dir="rtl">
        <div className="max-w-[80%] break-words rounded-[18px] rounded-tl-[4px] bg-[#312e81] px-4 py-2.5 text-[13.5px] font-medium leading-relaxed text-white shadow-sm">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 flex flex-col items-start animate-in fade-in slide-in-from-right-3 duration-200" dir="rtl">
      <div className="mb-0.8 flex items-center gap-2">
        <BotAvatar />
      </div>
      <div className="mr-9 inline-block max-w-[85%] whitespace-pre-wrap break-words rounded-[18px] rounded-tr-[4px] bg-[#f1f5f9] border border-slate-200/60 px-4 py-3 text-[13.5px] font-medium leading-relaxed text-slate-800 shadow-sm">
        <ReactMarkdown
          components={{
          p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pr-5 mb-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pr-5 mb-1">{children}</ol>,
          li: ({ children }) => <li className="mb-0.5">{children}</li>,
          strong: ({ children }) => <strong className="font-bold">{children}</strong>,
          code: ({ children }) => <code className="bg-slate-200 rounded px-1 text-xs font-mono">{children}</code>,
          }}>
           {message.text.replace(/\$([^$]+)\$/g, '$1')}
        </ReactMarkdown>
      </div>
    </div>
  );
};

const SuggestionChips = ({ onSelect }) => (
  <div className="mb-5 flex flex-wrap gap-2 justify-start pr-9" dir="rtl">
    {SUGGESTION_CHIPS.map((chip) => (
      <button
        key={chip}
        onClick={() => onSelect(chip)}
        className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#312e81] shadow-sm transition-all hover:scale-105 hover:border-[#312e81] hover:bg-indigo-50/30"
      >
        {chip}
      </button>
    ))}
  </div>
);

const ChatBot = () => {

  const { userId, userRole } = useAuth();
  const isStudent = userRole?.toLowerCase() === 'student';

  const [isOpen, setIsOpen] = useState(false);
  const [isMin, setIsMin] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [chipsVisible, setChipsVisible] = useState(true);
  const [messages, setMessages] = useState([
    { id: 0, role: 'bot', text: "مرحبًا 👋\nأنا UNIQ Assistant، مساعدك الأكاديمي الذكي للمواد، المعدل، والخطة الدراسية.", intent: 'general_query'}
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeOverlay, setActiveOverlay] = useState(null); 

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  
  useEffect(() => {
    setMessages([{ id: 0, role: 'bot', text: "مرحبًا 👋\nأنا UNIQ Assistant، مساعدك الأكاديمي الذكي للمواد، المعدل، والخطة الدراسية.", intent: 'general_query'}]);
    setIsOpen(false);
    setChipsVisible(true);
    setActiveOverlay(null);
    setInput('');
  }, [userId]);

  useEffect(() => {
    if (isOpen && !isMin) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isOpen, isMin]);

  useEffect(() => {
    if (isOpen && !isMin && !activeOverlay) setTimeout(() => inputRef.current?.focus(), 150);
  }, [isOpen, isMin, activeOverlay]);

  const handleBotReply = useCallback((text, intent = 'general_query') => {
    setMessages((p) => [...p, { id: Date.now(), role: 'bot', text, intent }]);
  }, []);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    
    setChipsVisible(false);
    setMessages((p) => [...p, { id: Date.now(), role: 'user', text }]);
    setInput('');
    setIsLoading(true);
    
    try {
      const replyData = await sendChatMessage(text);
      const replyText = replyData.answer || replyData.text || '';
      const isDenied = replyText.includes('❌') || replyText.includes('متاحة فقط');

if (replyData.intent === 'gpa_calc' && !isDenied && isStudent) {
        setActiveOverlay('calc');
      } else if (replyData.intent === 'gpa_plan' && !isDenied && isStudent) {
        setActiveOverlay('plan');
      } else {
        handleBotReply(replyText, replyData.intent);
      }
      
    } catch (err) {
      const s = err?.response?.status;
      const t = s === 429 ? 'عذراً، أرسلت طلبات كثيرة. يرجى الانتظار قليلاً.'
              : s === 400 ? 'يرجى إدخال سؤال صالح.'
              : 'حدث خطأ ما. يرجى المحاولة مرة أخرى.';
      handleBotReply(t, 'error');
    } finally {
      setIsLoading(false);
    }
 }, [input, isLoading, handleBotReply, isStudent]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleChipSelect = (text) => {
    setInput(text);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const closeOverlay = () => setActiveOverlay(null);

  const handleFormComplete = (replyText) => {
    const dynamicIntent = activeOverlay === 'calc' ? 'gpa_calc' : activeOverlay === 'plan' ? 'gpa_plan' : 'general_query';
    closeOverlay();
    handleBotReply(replyText, dynamicIntent);
  };

  const canSend = input.trim().length > 0 && !isLoading;

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => { setIsOpen(true); setIsMin(false); }}
          title="Open UNIQ Assistant"
          className="group fixed bottom-7 right-7 z-[9999] flex h-[60px] w-[60px] items-center justify-center rounded-full bg-gradient-to-tr from-[#312e81] to-indigo-600 text-white shadow-[0_8px_25px_rgba(49,46,129,0.4)] transition-all duration-300 hover:scale-110 hover:shadow-[0_12px_35px_rgba(49,46,129,0.5)] animate-in zoom-in duration-300"
        >
          <div className="transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
            <IconFab />
          </div>
        </button>
      )}

      {isOpen && (
        <div
          className={`fixed bottom-7 right-7 z-[9999] flex flex-col overflow-hidden rounded-[1.3rem] border border-slate-200/80 bg-white shadow-[0_16px_48px_rgba(15,23,42,0.15)] transition-all duration-300 ease-out animate-in slide-in-from-bottom-8 zoom-in-95 ${
            isMin ? 'h-auto w-[350px]' :isExpanded
  ? 'h-[90vh] w-[80vw] max-w-[1000px]'
  : 'h-[550px] w-[380px]'
          }`}
        >
          <div className="flex shrink-0 items-center justify-between bg-indigo-900 border-b border-indigo-950/40 px-4 py-3.5 z-[60] shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-sm">
                <IconHeader />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-[#1e1b4b] animate-pulse" />
              </div>
              <div>
                <div className="text-[14px] font-bold tracking-wide text-white">
                  UNIQ Assistant
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button onClick={() => setIsExpanded(v => !v)} title={isExpanded ? "Collapse" : "Expand"} className="flex h-7 w-7 items-center justify-center rounded-lg text-indigo-200/80 transition-all hover:bg-white/10 hover:text-white">
                {isExpanded ? <FiMinimize2 size={14} /> : <FiMaximize2 size={14} />}
              </button>
              <button onClick={() => setIsOpen(false)} title="Close" className="flex h-7 w-7 items-center justify-center rounded-lg text-indigo-200/80 transition-all hover:bg-white/10 hover:text-white">
                <FiX size={16} />
              </button>
            </div>
          </div>

          {!isMin && (
            <div className="relative flex flex-1 flex-col overflow-hidden bg-slate-50/50">
              
              {activeOverlay && (
                <div className="absolute inset-0 z-50 flex flex-col bg-white animate-in slide-in-from-bottom-6 duration-200">
                  <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-2.5" dir="rtl">
                    <span className="text-xs font-bold text-slate-500">
                    </span>
                    <button 
                      onClick={closeOverlay}
                      className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-[#312e81] hover:bg-indigo-50 transition-colors"
                    >
                      رجوع للشات <FiArrowRight size={14} />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 smooth-scrollbar">
                    {activeOverlay === 'calc' ? (
                      <GpaCalculatorForm onComplete={handleFormComplete} />
                    ) : (
                      <GpaPlanForm onComplete={handleFormComplete} />
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-1 flex-col overflow-y-auto p-4 pb-2 smooth-scrollbar">
                {messages.map((msg) => (
                  <MessageRow key={msg.id} message={msg} />
                ))}

                {chipsVisible && <SuggestionChips onSelect={handleChipSelect} />}

                {isLoading && (
                  <div className="mb-5 flex flex-col items-start animate-in fade-in slide-in-from-right-2" dir="rtl">
                    <div className="mb-0.8 flex items-center gap-2">
                      <BotAvatar />
                    </div>
                    <div className="mr-9 inline-block rounded-[18px] rounded-tr-[4px] bg-[#f1f5f9] border border-slate-200/60 px-4 py-3 shadow-sm">
                      <TypingDots />
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              <div className="flex shrink-0 items-end gap-2 border-t border-slate-100 bg-white p-3">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="اسألني عن أي حاجة..."
                  dir="rtl" 
                  rows={1}
                  className="max-h-[100px] min-h-[44px] w-full flex-1 resize-none overflow-y-auto rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13.5px] leading-relaxed text-slate-800 text-right outline-none transition-all duration-200 focus:border-[#312e81] focus:bg-white no-scrollbar"
                  onInput={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={!canSend}
                  className={`flex h-[40px] w-[40px] mb-[2px] shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
                    canSend 
                      ? 'bg-[#312e81] text-white shadow-md hover:bg-indigo-800' 
                      : 'cursor-not-allowed bg-slate-100 text-slate-400'
                  }`}
                >
                  <FiArrowUp size={20} strokeWidth={2.5} />
                </button>
              </div>

            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatBot;