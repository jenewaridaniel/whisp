import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import logo from '../assets/comp.png'; 

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
     

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 md:py-36">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Drop Your Secrets. <span className="bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">No Names, No Judgment.</span>
          </motion.h1>
          <motion.p
            className=" text-md md:text-xl text-gray-600 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            A safe, anonymous space to confess, vent, and be real without fear.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link
              to="/post"
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full font-medium hover:shadow-lg transition-all hover:scale-105"
            >
              Post a Confession
            </Link>
            <Link
              to="/feed"
              className="px-8 py-3 bg-white text-gray-800 border border-gray-200 rounded-full font-medium hover:shadow-lg transition-all hover:scale-105"
            >
              View Confessions
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className=" text-3xl font-bold text-gray-900 mb-6">Get it off your chest</h2>
            <p className=" text-md md:text-xl text-gray-600">
              Sometimes you just need to get it off your chest without the drama. Whisp lets you share your confessions anonymously no profiles, no judgment, just your truth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.h2 
            className="text-3xl font-bold text-center text-gray-900 mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            How it works
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Write Anonymously",
                description: "Share your thoughts, secrets, or confessions without revealing your identity.",
                icon: "✍️"
              },
              {
                title: "Read & Relate",
                description: "Discover others' confessions and find comfort in shared experiences.",
                icon: "👀"
              },
              {
                title: "Support Others",
                description: "React or comment anonymously to show support and understanding.",
                icon: "❤️"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Note */}
      <section className="py-16 bg-gradient-to-r from-pink-50 to-orange-50">
        <div className="container mx-auto px-6">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your privacy matters</h2>
            <p className="text-gray-700">
              Whisp respects your privacy. No data is collected, and all posts are anonymous. Please keep it kind and legal.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 border-t border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent mb-4 md:mb-0">
            <img src={logo} className=' w-24' alt="" />
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-pink-500 transition">Privacy</a>
            </div>
          </div>
          <div className="mt-6 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Whisp. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;