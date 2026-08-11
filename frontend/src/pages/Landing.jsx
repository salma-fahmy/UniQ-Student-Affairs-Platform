import Navbar from "../Components/Nav/Navbar";
import HeroSection from "../Components/Herosection/HeroSection";
import Services from "../Components/Card/Services";
import AboutUniq from "../Components/About/AboutUniq";
import ContactForm from "../Components/ContactForm/ContactForm";
import Footer from "../Components/footer/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section id="home" className="scroll-mt-24">
          <HeroSection />
        </section>
        <section id="about" className="scroll-mt-24">
          <AboutUniq />
        </section>
        <section id="services" className="scroll-mt-24">
          <Services />
        </section>
        <section id="contact" className="scroll-mt-24">
          <ContactForm />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;