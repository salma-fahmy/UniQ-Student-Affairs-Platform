import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import Logoo from "../../Components/Nav/Logoo";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (page, id) => {
    if (location.pathname === page) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate(page);
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  return (
    <footer className="bg-indigo-950 text-white pt-16 pb-8 mt-24">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid md:grid-cols-4 gap-12 pb-12">
          {/* Logo & About */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <Logoo textColor="text-white" />
            </div>
            <p className="text-indigo-300 text-sm leading-relaxed">
              A leading institution committed to supporting students through
              advanced digital services.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white text-lg">Quick Links</h3>
            <ul className="space-y-3 text-indigo-300 text-sm">
              <li 
                onClick={() => handleNavigation('/', 'home')}
                className="hover:text-white hover:translate-x-1 cursor-pointer transition-all duration-200"
              >
                Home
              </li>
              <li 
                onClick={() => handleNavigation('/', 'about')}
                className="hover:text-white hover:translate-x-1 cursor-pointer transition-all duration-200"
              >
                About Us
              </li>
              <li 
                onClick={() => handleNavigation('/', 'services')}
                className="hover:text-white hover:translate-x-1 cursor-pointer transition-all duration-200"
              >
                Services
              </li>
              <li 
                onClick={() => handleNavigation('/', 'contact')}
                className="hover:text-white hover:translate-x-1 cursor-pointer transition-all duration-200"
              >
                Contact
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4 text-white text-lg">Contact Us</h3>
            <div className="space-y-3 text-indigo-300 text-sm">
              
{/* Location Link (Opens Google Maps directly) */}
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Faculty+of+Computer+and+Data+Science,+Alexandria+University,+Smouha,+Alexandria+Governorate,+Egypt"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 hover:text-white transition-colors duration-200 cursor-pointer group"
              >
                <FaMapMarkerAlt className="text-indigo-400 mt-1 flex-shrink-0 group-hover:animate-bounce" />
                <span className="leading-relaxed">Alexandria University, Smouha, Alexandria Governorate, Egypt</span>
              </a>

              {/* Phone Link */}
              <a 
                href="tel:+123456789" 
                className="flex items-center gap-3 hover:text-white transition-colors duration-200"
              >
                <FaPhoneAlt className="text-indigo-400 flex-shrink-0" />
                <span>+123 456 789</span>
              </a>

              {/* Email Link */}
              <a 
                href="mailto:info@uniq.edu" 
                className="flex items-center gap-3 hover:text-white transition-colors duration-200"
              >
                <FaEnvelope className="text-indigo-400 flex-shrink-0" />
                <span>uniqsupport5@gmail.com</span>
              </a>

            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold mb-4 text-white text-lg">Follow Us</h3>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/FCDS.AlexU/?locale=ar_AR"
                target="_blank" 
  rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center 
                           bg-indigo-800/50 rounded-full 
                           text-indigo-300 hover:text-white 
                           hover:bg-indigo-700 transition-all duration-200"
                aria-label="Facebook"
              >
                <FaFacebookF size={16} />
              </a>
              {/* <a
                href="#"
                className="w-10 h-10 flex items-center justify-center 
                           bg-indigo-800/50 rounded-full 
                           text-indigo-300 hover:text-white 
                           hover:bg-indigo-700 transition-all duration-200"
                aria-label="Instagram"
              >
                <FaInstagram size={16} />
              </a> */}
              {/* <a
                href="#"
                className="w-10 h-10 flex items-center justify-center 
                           bg-indigo-800/50 rounded-full 
                           text-indigo-300 hover:text-white 
                           hover:bg-indigo-700 transition-all duration-200"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn size={16} />
              </a> */}
            </div>
            <p className="text-indigo-300 text-xs mt-6 leading-relaxed">
              Stay connected with us on social media for latest updates and news.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-indigo-800/50 pt-8 flex justify-center items-center text-sm text-indigo-200">
          <p>© 2026 UNIQ University. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;