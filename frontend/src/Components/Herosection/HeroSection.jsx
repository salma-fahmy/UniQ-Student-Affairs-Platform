import { useEffect, useMemo, useState } from 'react';
import heroImg from "../../assets/Hero/office_refined_final.png";
import { fetchCollageStats } from '../../services/landingService';




const HeroSection = () => {
  const [stats, setStats] = useState({
    studentNumber: null,
    facultyNumber: null,
    facultyServices: null,
  });

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      try {
        const response = await fetchCollageStats();

        if (!isMounted) {
          return;
        }

        setStats({
          studentNumber: Number(response?.studentNumber) || 0,
          facultyNumber: Number(response?.facultyNumber) || 0,
          facultyServices: Number(response?.facultyServices) || 0,
        });
      } catch {
        if (isMounted) {
          setStats({
            studentNumber: 0,
            facultyNumber: 0,
            facultyServices: 0,
          });
        }
      }
    };

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const heroStats = useMemo(() => ([
    {
      key: 'studentNumber',
      label: 'Student Number',
      value: stats.studentNumber,
    },
    {
      key: 'facultyNumber',
      label: 'Faculty Number',
      value: stats.facultyNumber,
    },
    {
      key: 'facultyServices',
      label: 'Faculty Services',
      value: stats.facultyServices,
    },
  ]), [stats]);

  return (
   <section className="relative  min-h-screen  py-32  bg-gradient-to-br from-white via-indigo-50 to-white overflow-hidden">

        {/* Gradient Background Shape - Hidden on Mobile */}
        <div className="hidden sm:block absolute 
                            top-20 -left-12
                        w-[300px] h-[300px] sm:w-[400px] sm:h-[400px]
                        bg-gradient-to-br from-indigo-200/10 to-indigo-300/30
                        rounded-full
                        translate-x-12 translate-y-12 blur-sm">
        </div>
      {/* Soft Background Glow - Adjusted for Mobile */}
      <div className="absolute top-24 -right-32 sm:right-0 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-indigo-200/40 rounded-full blur-3xl"></div>

     <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            

          {/* Left Content */}
          <div className="w-full">
            <p className="text-sm tracking-widest font-semibold text-indigo-800 relative inline-block mb-8">
              WELCOME TO UNIQ
              <span className="absolute left-0 -bottom-2 w-full h-[2px] bg-indigo-800"></span>
            </p>

            <h1 className="font-playfair text-4xl md:text-5xl font-semibold text-indigo-900 leading-[1.1] mb-8">
              Shaping the Future 
              <br className="hidden sm:block" /> of Students Affairs
            </h1>

            <p className="text-gray-800 mb-10 leading-relaxed font-['Open_Sans']">
              Empowering students through innovative digital solutions that
              simplify academic services and enhance university life.
            </p>

            {/* Stats */}
            <div className="mt-10 hidden md:flex md:gap-12">
              {heroStats.map((item) => (
                <div key={item.key}>
                  <h3 className="text-3xl font-semibold text-indigo-800">
                    {Number.isFinite(item.value) ? item.value.toLocaleString() : '...'}
                  </h3>
                  <p className="text-sm text-gray-500">{item.label}</p>
                </div>
              ))}
            </div>
           <div className="flex gap-4 mt-8">
  <button 
    onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
    className="px-6 py-3 rounded-full bg-indigo-800 text-white font-medium hover:bg-indigo-900 transition"
  >
    Explore Services
  </button>

  <button 
    onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
    className="px-6 py-3 rounded-full border border-indigo-200 text-indigo-700 font-medium hover:bg-indigo-50 transition"
  >
    Learn More
  </button>
</div>
          </div>

          {/* Right Image */}
          <div className="relative mt-8 md:mt-0 flex justify-center md:justify-end md:order-2">

            {/* Premium Glow Behind Image */}
            <div className="absolute 
                            top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                            w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] lg:w-[600px] lg:h-[600px]
                            bg-[radial-gradient(circle,_#e0e7ff_0%,_transparent_70%)]
                            rounded-full 
                            -z-10 
                            blur-3xl opacity-60 sm:opacity-80">
            </div>

                  {/* Image Card */}
                  <div className="relative w-full h-[300px] sm:h-[480px] rounded-[10px] overflow-hidden border border-white/40 shadow-[0_25px_80px_-20px_rgba(79,70,229,0.35)] bg-indigo-50">

                    {/* Soft Overlay */}
                    <div className="absolute inset-0 bg-indigo-900/5 z-10 mix-blend-overlay"></div>

                    <img
                      src={heroImg}
                      alt="Students"
                      className="w-full h-full object-cover object-center transition duration-700 hover:scale-105"
                    />

                  </div>

          </div>

        </div>
      </div>

      {/* Bottom Divider */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-indigo-100"></div>

    </section>
  );
};

export default HeroSection;