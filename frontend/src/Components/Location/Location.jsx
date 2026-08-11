import React from 'react';

const Location = () => {
  // Convert your provided link to an embed URL
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d218398.37236703475!2d29.942067!3d31.207579!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f5c5d821dee8fd%3A0x2155d145501e691f!2z2YPZhNmK2Kkg2KfZhNit2KfYs9io2KfYqiDZiNi52YTZiNmFINin2YTYqNmK2KfZhtin2Kog2KzYp9mF2LnYqSDYp9mE2KXYs9mD2YbYr9ix2YrYqQ!5e0!3m2!1sar!2seg!4v1781269933012!5m2!1sar!2seg";

  return (
    <section id="location" className="relative py-24 bg-gradient-to-b from-white to-indigo-50/30 overflow-hidden">
      {/* Background decorative shapes (consistent with other components) */}
      <div className="absolute top-20 -left-12 w-[400px] h-[400px] bg-gradient-to-br from-indigo-200/10 to-indigo-300/30 rounded-full translate-x-12 translate-y-12 blur-sm"></div>
      <div className="absolute bottom-20 right-0 w-[500px] h-[500px] bg-indigo-300/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm tracking-widest font-semibold text-indigo-800 inline-block relative mb-4">
            OUR LOCATION
            <span className="absolute left-0 -bottom-2 w-full h-[2px] bg-indigo-800"></span>
          </p>
          <h2 className="font-playfair text-4xl md:text-5xl font-semibold text-indigo-900 mb-6">
            Find Us at <br />Alexandria University
          </h2>
          <p className="text-gray-600 font-['Open_Sans']">
            Faculty of Computer and Data Science, Smouha, Alexandria
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Map Container */}
          <div className="relative h-[400px] md:h-[450px] rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(79,70,229,0.3)] border border-white/40">
            <iframe
              src={mapEmbedUrl}
              className="absolute top-0 left-0 w-full h-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Faculty of Computer and Data Science Location"
            ></iframe>
          </div>

          {/* Location Info */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-indigo-100">
              <h3 className="font-playfair text-2xl font-semibold text-indigo-900 mb-4">
                Faculty of Computer <br />and Data Science
              </h3>
              
              <div className="space-y-4 text-gray-700">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-indigo-800">Address:</p>
                    <p>Alexandria University, Smouha, Alexandria Governorate, Egypt</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-indigo-800">Opening Hours:</p>
                    <p>8:00 AM – 6:00 PM</p>
                    <p className="text-sm text-gray-500 mt-1">* Please check for holiday variations</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-indigo-800">Nearby:</p>
                    <p>Bayern Academy (University City Branch) - 24/7 Sports Club</p>
                  </div>
                </div>
              </div>

              {/* Direction Button */}
              <a
                href="https://maps.app.goo.gl/UZ2AanFPtQzCTR1v5"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 bg-indigo-900 text-white px-6 py-3 rounded-full 
                         transition-transform duration-300 ease-out hover:scale-105 active:scale-95"
              >
                Get Directions
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Divider */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-indigo-100"></div>
    </section>
  );
};

export default Location;