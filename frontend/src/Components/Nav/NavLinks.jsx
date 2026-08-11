import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const links = [
  { name: 'Home', id: 'home', page: '/' },
  { name: 'About', id: 'about', page: '/' },
  { name: 'Services', id: 'services', page: '/' },
  { name: 'College', id: 'college', page: '/collage' },
  { name: 'Location', id: 'location', page: '/collage' },
  { name: 'Contact', id: 'contact-section', page: '/' },
];

const NavLinks = ({ onMobileMenuClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('');
  
  const isNavigatingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  const scrollToElement = (id) => {
    const element = document.getElementById(id);
    if (element) {
      isNavigatingRef.current = true;
      setActiveSection(id);
      
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
      
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isNavigatingRef.current = false;
      }, 1000);
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      if (!scrollToElement(targetId)) {
        let retries = 0;
        const interval = setInterval(() => {
          if (scrollToElement(targetId) || retries > 10) {
            clearInterval(interval);
          }
          retries++;
        }, 150);
      }
    } else if (window.scrollY < 100) {
      const defaultLink = links.find(l => l.page === location.pathname);
      if (defaultLink) setActiveSection(defaultLink.id);
    }
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const handleScroll = () => {
      if (isNavigatingRef.current) return;

      const currentLinks = links.filter(link => link.page === location.pathname);
      let currentActive = '';

      for (const link of currentLinks) {
        const el = document.getElementById(link.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 3) {
            currentActive = link.id;
          }
        }
      }

      if (window.scrollY < 100 && currentLinks.length > 0) {
        currentActive = currentLinks[0].id;
      }

      if (currentActive && currentActive !== activeSection) {
        setActiveSection(currentActive);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname, activeSection]);

  const handleNavClick = (e, targetId, targetPage) => {
    e.preventDefault();
    if (onMobileMenuClose) onMobileMenuClose();

    if (location.pathname === targetPage) {
      window.history.replaceState(null, '', `${targetPage}#${targetId}`);
      scrollToElement(targetId);
    } else {
      navigate(`${targetPage}#${targetId}`);
    }
  };

  return (
    <ul className="flex flex-col lg:flex-row lg:items-center lg:space-x-12 space-y-3 lg:space-y-0 text-base sm:text-lg lg:text-xl font-medium tracking-wide">
      {links.map((item) => {
        const isActive = activeSection === item.id && location.pathname === item.page;
        return (
          <li key={item.name}>
            <a
              href={`${item.page}#${item.id}`}
              onClick={(e) => handleNavClick(e, item.id, item.page)}
              className={`relative inline-flex w-fit py-2 font-['Manrope'] text-indigo-900 transition-all duration-300
                         after:content-[''] after:absolute after:left-0 after:-bottom-1
                         after:h-[2px] after:bg-indigo-600
                         after:transition-all after:duration-300
                         hover:font-semibold hover:after:w-full
                         ${isActive ? 'font-semibold after:w-full' : 'font-medium after:w-0'}`}
            >
              {item.name}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default NavLinks;