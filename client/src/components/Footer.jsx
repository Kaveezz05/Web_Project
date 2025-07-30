import React from 'react';
import { assets } from '../assets/assets';
import {
  FaYoutube,
  FaGithub,
  FaTiktok,
  FaMapMarkerAlt,
  FaInstagram,
  FaFacebook,
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="px-6 pt-16 md:px-16 lg:px-36 mt-40 w-full text-gray-300 bg-gradient-to-b from-[#0F1A32] to-black">
      <div className="flex flex-col md:flex-row justify-between gap-10 border-b border-gray-600 pb-20">
        {/* Logo + Description */}
        <div className="md:max-w-sm">
          <img className="w-48 h-auto" src={assets.logo} alt="logo" />
          <p className="mt-6 text-sm leading-relaxed">
            VistaLite is your modern destination for movie magic. Explore, book, and enjoy seamless ticketing — anywhere, anytime.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <img src={assets.googlePlay} alt="Google Play" className="h-9 w-auto" />
            <img src={assets.appStore} alt="App Store" className="h-9 w-auto" />
          </div>
        </div>

        {/* Links & Contact */}
        <div className="flex-1 flex flex-col md:flex-row gap-10 md:gap-20 justify-between">
          <div>
            <h2 className="font-semibold mb-4">Company</h2>
            <ul className="text-sm space-y-2">
              <li><a href="#" className="hover:text-white">Home</a></li>
              <li><a href="#" className="hover:text-white">About us</a></li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold mb-4">Get in Touch</h2>
            <div className="text-sm space-y-2">
              <p>vistalite@gmail.com</p>
              <p>011 2295653</p>
              <p className="flex items-center gap-1">
                <FaMapMarkerAlt className="text-[#4A90E2]" />
                Colombo 07, Sri Lanka
              </p>
            </div>

            <div className="flex gap-4 mt-4 text-xl">
              <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                <FaGithub />
              </a>
              <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                <FaYoutube />
              </a>
              <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                <FaTiktok />
              </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white" >
                <FaFacebook />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <FaInstagram />
            </a>
            </div>
          </div>

          {/* Embedded Map */}
          <div className="w-full md:w-64">
            <h2 className="font-semibold mb-4">Our Location</h2>
            <div className="rounded-lg overflow-hidden border border-[#4A9EDE]/30 shadow-md">
              <iframe
                title="VistaLite Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63310.225168149345!2d79.8437309!3d6.9270787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2592529d8880f%3A0x2c252c5e07c01e04!2sColombo%2007!5e0!3m2!1sen!2slk!4v1694173383644!5m2!1sen!2slk"
                width="100%"
                height="180"
                style={{ border: 0, filter: 'grayscale(100%) brightness(70%) contrast(120%)' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      <p className="pt-6 text-center text-sm text-gray-400 pb-5">
        © {new Date().getFullYear()} VistaLite. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
