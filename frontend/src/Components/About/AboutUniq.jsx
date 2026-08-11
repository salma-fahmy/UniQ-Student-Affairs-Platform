import React from 'react';
import About from './About';
import aboutImage from '../../assets/About/uniq_custom_dashboard_clean.jpg';

const AboutUniq = () => {
  const stats = [
    { value: '15+', label: 'Years of Excellence' },
    { value: '50+', label: 'Partner Universities' },
    { value: '98%', label: 'Graduate Employability' }
  ];

  return (
    <section className="relative py-24 bg-gradient-to-br from-white via-indigo-50/30 to-white overflow-hidden">
      <div className="absolute top-40 left-0 w-[600px] h-[600px] bg-indigo-200/20 rounded-full blur-3xl"></div>
      <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
        <About
          image={aboutImage}
          title="Empowering Students Since 2010"
          description="UNIQ was founded with a single mission: to transform the student experience through innovative digital solutions. We combine cutting-edge technology with personalized support to create an environment where every student can thrive. Our dedicated team works tirelessly to simplify academic processes and foster a vibrant campus community."
          stats={stats}
          badgeText="ABOUT UNIQ"
        />
      </div>
    </section>
  );
};

export default AboutUniq;