import api from './api';

export const sendContactForm = async (payload) => {
    try{
  const response = await api.post('/auth/contact-form', payload);

  return response.data;
  } catch (error) {
    console.error("Error submitting contact form:", error);
    throw error.response?.data?.message || "Something went wrong. Please try again.";
  }

};

