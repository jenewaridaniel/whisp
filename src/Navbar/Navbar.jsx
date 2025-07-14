import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu,
  FiX,
  FiHome,
  FiEdit,
  FiMessageSquare,
  FiShield,
  FiSend,
} from "react-icons/fi";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import logo from "../assets/comp.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showNavbar, setShowNavbar] = useState(true);

  const navLinks = [
    { name: "Home", href: "/", icon: <FiHome className="text-orange-500" /> },
    {
      name: "Post",
      href: "/post",
      icon: <FiEdit className="text-orange-500" />,
    },
    {
      name: "Feed",
      href: "/feed",
      icon: <FiMessageSquare className="text-orange-500" />,
    },
    {
      name: "Privacy",
      href: "/privacy",
      icon: <FiShield className="text-orange-500" />,
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNavbar(false);
      } else if (currentScrollY < lastScrollY || currentScrollY <= 100) {
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <AnimatePresence>
        {showNavbar && (
          <motion.nav
            initial={{ y: 0 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white/80 backdrop-blur-md py-3 fixed top-0 w-full z-50 border-b border-gray-100"
          >
            <div className="container mx-auto px-4 py-3">
              <div className="flex justify-between items-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center"
                >
                  <Link to="/" className="text-2xl font-bold">
                    <img src={logo} className="w-24" alt="Whisp Logo" />
                  </Link>
                </motion.div>

                <div className="hidden md:flex items-center space-x-8">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Link
                        to={link.href}
                        className="text-gray-700 hover:text-orange-500 tracking-wider transition-colors relative group flex items-center gap-1"
                      >
                        {link.name}
                        <motion.span
                          className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500 group-hover:w-full transition-all duration-300"
                          layoutId="navUnderline"
                        />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="flex items-center space-x-4">
                  {/* Updated Send Button with Link */}
                  <Link to="/post">
                    <motion.button
                      className="hidden md:flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all font-bold tracking-wide relative overflow-hidden"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
                      }}
                      whileTap={{
                        scale: 0.98,
                        boxShadow: "0 5px 15px -3px rgba(0, 0, 0, 0.1)",
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: 0.3 },
                      }}
                    >
                      <FiSend />
                      <span>Send Anonymously</span>
                    </motion.button>
                  </Link>

                  <motion.button
                    onClick={toggleMenu}
                    className="md:hidden p-2 text-gray-700"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={toggleMenu}
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-80 bg-white z-50 shadow-2xl"
            >
              <div className="h-full flex flex-col">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <Link to="/" className="text-xl font-bold">
                    <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                      whisp
                    </span>
                  </Link>
                  <button
                    onClick={toggleMenu}
                    className="p-2 text-gray-500 hover:text-orange-500"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                  <ul className="space-y-2 px-4">
                    {navLinks.map((link, index) => (
                      <motion.li
                        key={link.name}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Link
                          to={link.href}
                          className="flex items-center px-4 py-3 text-gray-700 hover:bg-orange-50 rounded-lg transition-colors"
                          onClick={toggleMenu}
                        >
                          <span className="mr-3">{link.icon}</span>
                          {link.name}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </nav>

                <div className="px-6 py-4 border-t border-gray-100">
                  <Link to="/post">
                    <motion.button
                      className="flex w-full items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-bold tracking-wide"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
                      }}
                      whileTap={{
                        scale: 0.98,
                        boxShadow: "0 5px 15px -3px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <FiSend />
                      <span>Send Anonymously</span>
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
