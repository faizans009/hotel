import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">DeJourneys</h3>
                        <p className="text-sm leading-relaxed">
                            Your trusted platform for finding the perfect hotel accommodations worldwide. Book with confidence, travel with ease.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition">Home</a></li>
                            <li><a href="#" className="hover:text-white transition">Browse Hotels</a></li>
                            <li><a href="#" className="hover:text-white transition">My Bookings</a></li>
                            <li><a href="#" className="hover:text-white transition">About Us</a></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                            <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
                            <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition">Terms & Conditions</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contact Info</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-2">
                                <Phone size={16} />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail size={16} />
                                <span>support@dejourneys.com</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <MapPin size={16} />
                                <span>Pakistan</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <hr className="border-gray-700 my-8" />

                {/* Social & Copyright */}
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-gray-400">
                        &copy; {currentYear} DeJourneys. All rights reserved.
                    </p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition">
                            <Facebook size={20} />
                        </a>
                        <a href="#" className="hover:text-white transition">
                            <Twitter size={20} />
                        </a>
                        <a href="#" className="hover:text-white transition">
                            <Instagram size={20} />
                        </a>
                        <a href="#" className="hover:text-white transition">
                            <Linkedin size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
