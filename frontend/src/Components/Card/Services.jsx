import React from 'react';
import Card from './Card';
import requestsImage from '../../assets/Services/request.jpg';
import service2 from '../../assets/Services/service-community.jpg';
import service3 from '../../assets/Services/service-career.jpg';
import service4 from '../../assets/Services/service-health.jpg';

// Service data with targetId for scrolling
const servicesData = [
  {
    id: 1,
    image: requestsImage,
    title: 'Requests',
    description: 'Students can submit official requests and track them easily through the digital platform.',
    linkText: 'Learn More',
    targetId: 'service-requests'
  },
  {
    id: 2,
    image: service2,
    title: 'Complaints',
    description: 'Submit and track complaints efficiently, with smooth communication with staff.',
    linkText: 'Learn More',
    targetId: 'service-complaints'
  },
  {
    id: 3,
    image: service3,
    title: 'Payments',
    description: 'View student dues and outstanding balances, and keep track of all financial records.',
    linkText: 'Learn More',
    targetId: 'service-payments'
  },
  {
    id: 4,
    image: service4,
    title: 'Chatbot',
    description: 'An intelligent Arabic-speaking assistant guides students and answers questions in both formal and colloquial Arabic.',
    linkText: 'Learn More',
    targetId: 'service-chatbot'
  }
];

const Services = () => {
  return (
    <section className="relative py-24 bg-gradient-to-b from-white to-indigo-50/30 overflow-hidden">
      {/* Background decorative shapes */}
      <div className="absolute top-40 -left-20 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-0 w-[500px] h-[500px] bg-indigo-300/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm tracking-widest font-semibold text-indigo-800 inline-block relative mb-4">
            OUR SERVICES
            <span className="absolute left-0 -bottom-2 w-full h-[2px] bg-indigo-800"></span>
          </p>
          <h2 className="font-playfair text-4xl md:text-5xl font-semibold text-indigo-900 mb-6">
            Everything You Need <br />to Succeed
          </h2>
          <p className="text-gray-600 font-['Open_Sans']">
            Comprehensive support services designed to enhance your university experience.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {servicesData.map(service => (
            <Card key={service.id} {...service} />
          ))}
        </div>

        {/* Service Detail Sections (hidden until scrolled to) */}
        <div className="mt-24 space-y-16">
          {servicesData.map(service => (
            <section
              key={service.id}
              id={service.targetId}
              className="scroll-mt-24 p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-indigo-100"
            >
              <h3 className="font-playfair text-3xl font-semibold text-indigo-900 mb-4">
                {service.title}
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                {service.description}
              </p>
              {/* Additional details can be added here */}
              <p className="text-gray-600">
                Our {service.title.toLowerCase()} service is designed to provide seamless support. 
                For more information, please contact our office or visit the student portal.
              </p>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;