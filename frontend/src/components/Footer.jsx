import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5" data-testid="footer">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <span className="font-display text-3xl font-bold text-[#D4AF37]">
                E&F
              </span>
            </Link>
            <p className="text-[#A1A1AA] text-sm leading-relaxed mb-6">
              Building exceptional homes in Cyprus since 1971. Over 50 years of trust, quality, and excellence in real estate development.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#A1A1AA] hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-colors" data-testid="social-facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#A1A1AA] hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-colors" data-testid="social-instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#A1A1AA] hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-colors" data-testid="social-linkedin">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#A1A1AA] hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-colors" data-testid="social-youtube">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg text-[#EDEDED] mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'Our Projects', path: '/projects' },
                { name: 'New Launches', path: '/new-launches' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-[#A1A1AA] hover:text-[#D4AF37] transition-colors text-sm"
                    data-testid={`footer-link-${link.name.toLowerCase().replace(' ', '-')}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Featured Projects */}
          <div>
            <h4 className="font-display text-lg text-[#EDEDED] mb-6">Featured Projects</h4>
            <ul className="space-y-3">
              {[
                'Verso Residence',
                'Elias Residence',
                'Meca Twins',
                'Vladimiros Residence',
              ].map((project) => (
                <li key={project}>
                  <Link
                    to={`/property/${project.toLowerCase().replace(' ', '-')}`}
                    className="text-[#A1A1AA] hover:text-[#D4AF37] transition-colors text-sm"
                  >
                    {project}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display text-lg text-[#EDEDED] mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                <span className="text-[#A1A1AA] text-sm">
                  6 Laiou str., Anna Court, Block A,<br />
                  Flat/Office 502, 7th Floor,<br />
                  3015 Limassol, Cyprus
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                <a href="tel:+35725339143" className="text-[#A1A1AA] hover:text-[#D4AF37] text-sm transition-colors">
                  +357 25 339143
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                <a href="mailto:info@evangeloufrantzis.com" className="text-[#A1A1AA] hover:text-[#D4AF37] text-sm transition-colors">
                  info@evangeloufrantzis.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                <span className="text-[#A1A1AA] text-sm">
                  Mon-Fri: 09:00-18:00
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#52525B] text-sm">
              © {new Date().getFullYear()} Evangelou & Frantzis Developers. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-[#52525B] hover:text-[#A1A1AA] text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-[#52525B] hover:text-[#A1A1AA] text-sm transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
