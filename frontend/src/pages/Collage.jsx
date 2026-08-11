import React from 'react';
import Navbar from '../Components/Nav/Navbar';
import AboutCollage from '../Components/About/AboutCollage';
import Programs from '../Components/Card/Programs';
import Location from '../Components/Location/Location';
import Footer from '../Components/footer/Footer';

const Collage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section id="college" className="scroll-mt-24">
          <AboutCollage />
          <Programs />
          <Location />  {/* Location component already has its own id="location" */}
        </section>
        <section id="contact" className="scroll-mt-24">
          <Footer />
        </section>
      </main>
    </div>
  );
};

export default Collage;