import React, { useEffect, useRef, useState } from 'react';
import FormField from '../Shared/FormField';
import { sendContactForm } from '../../services/contactService';

const initialStatus = { type: null, message: '' };
const fallbackSuccessMessage = 'Your message has been sent successfully!';
const fallbackErrorMessage = 'We could not send your message right now. Please try again.';

const ContactForm = () => {
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(initialStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    if (submitStatus.type !== 'success' || !submitStatus.message) {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      setSubmitStatus(initialStatus);
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [submitStatus]);

  const validateEmailDetails = (email) => {
    if (!email.includes('@')) {
      return `Please include an '@' in the email address. '${email}' is missing an '@'.`;
    }
    const parts = email.split('@');
    if (parts.length > 2) {
      return `A part followed by '@' should not contain another '@' symbol.`;
    }
    if (!parts[1]) {
      return `Please enter a part following '@'. '${email}' is incomplete.`;
    }
    if (!parts[1].includes('.')) {
      return `The part after '@' should include a domain (e.g., .com).`;
    }
    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const fullName = String(formData.get('fullName') || '').trim();
    const subject = String(formData.get('subject') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();
    
    const newErrors = {};
    if (!fullName) {
      newErrors.fullName = 'Please enter your name';
    }
    
    const emailError = validateEmailDetails(email);
    if (!email) {
      newErrors.email = 'Please enter your email';
    } else if (emailError) {
      newErrors.email = emailError;
    }
    
    if (!message) {
      newErrors.message = 'Please enter a message.';
    } else if (message.length < 20) {
      newErrors.message = 'Message must be at least 20 characters.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitStatus(initialStatus);
    setIsSubmitting(true);

    try {
      await sendContactForm({
        fullName,
        subject: subject || 'inquiry',
        email,
        message,
      });

      formRef.current?.reset();

      setSubmitStatus({
        type: 'success',
        message: fallbackSuccessMessage,
      });
    } catch (error) {
      const responseData = error?.response?.data || error?.data;

      if (responseData?.errors?.fieldErrors) {
        const fieldErrors = responseData.errors.fieldErrors;
        const mappedErrors = {};

        if (fieldErrors.fullName) mappedErrors.fullName = fieldErrors.fullName[0];
        if (fieldErrors.email) mappedErrors.email = fieldErrors.email[0];
        if (fieldErrors.subject) mappedErrors.subject = fieldErrors.subject[0];
        if (fieldErrors.message) mappedErrors.message = fieldErrors.message[0];

        setErrors(mappedErrors);
        setSubmitStatus({
          type: 'error',
          message: responseData.message || 'Please fix the errors in the form.',
        });
      } else {
        const backendMessage = responseData?.message 
          || (typeof error === 'string' ? error : error.message) 
          || fallbackErrorMessage;

        setSubmitStatus({
          type: 'error',
          message: String(backendMessage).trim(),
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (submitStatus.type) {
      setSubmitStatus(initialStatus);
    }
    if (name === 'email' && value.trim()) {
      const error = validateEmailDetails(value);
      if (error) {
        setErrors(prev => ({ ...prev, email: error }));
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = '';

    if (name === 'fullName' && !value.trim()) {
      error = 'Please enter your name';
    } else if (name === 'email') {
      if (!value.trim()) {
        error = 'Please enter your email';
      } else {
        error = validateEmailDetails(value);
      }
    } else if (name === 'message') {
      if (!value.trim()) {
        error = 'Please enter a message.';
      } else if (value.trim().length < 20) {
        error = 'Message must be at least 20 characters.';
      }
    }

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  return (
    <section id="contact-section" className="relative py-24 bg-gradient-to-tr from-indigo-50/50 via-white to-indigo-50/50 overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/40 rounded-full blur-2xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm tracking-widest font-semibold text-indigo-800 inline-block relative mb-4">
            GET IN TOUCH
            <span className="absolute left-0 -bottom-2 w-full h-[2px] bg-indigo-800"></span>
          </p>
          <h2 className="font-playfair text-4xl md:text-5xl font-semibold text-indigo-900 mb-6">
            We're Here to Help
          </h2>
          <p className="text-gray-600 font-['Open_Sans']">
            Any questions or remarks? Just write us a message.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-[40px] shadow-2xl shadow-indigo-100 border border-indigo-50">
          <form 
            ref={formRef}
            onSubmit={handleSubmit}
            noValidate
            className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4"
          >
            <FormField
              label="Full Name"
              name="fullName"
              placeholder="John Doe"
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.fullName}
              required
            />
            
            <FormField
              label="Email Address"
              name="email"
              type="email"
              placeholder="example@uniq.com"
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              required
            />

            <div className="md:col-span-2">
              <FormField
                label="Subject (Optional)"
                name="subject"
                placeholder="What is this about?"
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.subject}
              />
            </div>

            <div className="md:col-span-2">
              <FormField
                label="Your Message"
                name="message"
                isTextArea
                placeholder="Write your message here..."
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.message}
                required
              />
            </div>

            <div className="md:col-span-2 flex flex-col items-center pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full md:w-1/2 py-4 px-8 rounded-full font-bold text-white transition-all duration-300 transform hover:-translate-y-1 active:scale-95 ${
                  isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-900 hover:bg-indigo-800 shadow-lg shadow-indigo-200'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Sending...</span>
                  </span>
                ) : 'Send Message'}
              </button>

              {submitStatus.message && (
                <div
                  role={submitStatus.type === 'error' ? 'alert' : 'status'}
                  aria-live={submitStatus.type === 'error' ? 'assertive' : 'polite'}
                  className={`mt-6 flex items-center space-x-2 px-6 py-3 rounded-xl border ${
                    submitStatus.type === 'error'
                      ? 'text-red-700 bg-red-50 border-red-100'
                      : 'text-green-700 bg-green-50 border-green-100'
                  }`}
                >
                  {submitStatus.type === 'error' ? (
                    <svg className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  <span className="font-semibold leading-tight">{submitStatus.message}</span>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;