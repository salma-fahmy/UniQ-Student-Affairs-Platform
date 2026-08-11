import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import Logoo from './Logoo';
import NavLinks from './NavLinks';
import Login from './Login';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-[100] w-full border-b border-slate-100 bg-white/90 backdrop-blur-md shadow-sm">
      
      <div className="mx-auto flex h-[78px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-12">
        
        {/* LEFT — Mobile Toggle + Logo */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            className="lg:hidden rounded-lg p-2 transition-colors hover:bg-slate-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <FiX size={24} className="text-indigo-900" />
            ) : (
              <FiMenu size={24} className="text-indigo-900" />
            )}
          </button>

          <Logoo />
        </div>

        {/* CENTER — Links (Desktop Only) */}
        <div className="hidden lg:flex flex-1 justify-center px-10">
          <NavLinks />
        </div>

        {/* RIGHT — Login / User */}
        <div className="flex shrink-0 items-center">
          <Login />
        </div>

      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute left-0 right-0 top-full bg-white border-b border-slate-100 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-[calc(100vh-78px)] space-y-2 overflow-y-auto px-4 py-4">
            <NavLinks onMobileMenuClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;