import api from '../../services/api';

/**
 * Send a message to the chatbot.
 * @param {string} query — the user's message
 * @returns {Promise<{text: string, intent: string}>} — the bot's reply and intent
 */
export const sendChatMessage = async (query) => {
  const response = await api.post('/chatbot/chat', { query });
  const data = response?.data?.data ?? response?.data ?? {};
  
  return {
    text: data.answer ?? data.reply ?? data.response ?? data.message ?? 'Sorry, I could not understand the response.',
    intent: data.intent || 'general_query'
  };
};

export const calculateGpa = async (subjects) => {
  const response = await api.post('/chatbot/calculate-gpa', { subjects });
  return response?.data?.data ?? response?.data ?? {};
};

export const planGpa = async (payload) => {
  const response = await api.post('/chatbot/plan-gpa', payload);
  return response?.data?.data ?? response?.data ?? {};
};