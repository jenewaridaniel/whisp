import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const Post = () => {
  const [confession, setConfession] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', or 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [profanityDetected, setProfanityDetected] = useState(false);

  // Simple profanity filter
  const profanityWords = ['fuck', 'shit', 'asshole', 'bitch', 'damn','ugly','fat'];
  
  const categories = [
    { value: '', label: 'Select a category (optional)' },
    { value: 'relationship', label: 'Relationship' },
    { value: 'school', label: 'School' },
    { value: 'family', label: 'Family' },
    { value: 'vent', label: 'Vent' },
    { value: 'other', label: 'Other' }
  ];

  const handleConfessionChange = (e) => {
    const text = e.target.value;
    if (text.length <= 500) {
      setConfession(text);
      
      // Check for profanity
      const hasProfanity = profanityWords.some(word => 
        new RegExp(`\\b${word}\\b`, 'i').test(text)
      );
      setProfanityDetected(hasProfanity);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!confession.trim()) {
      setErrorMessage('Please write your confession before submitting');
      setSubmitStatus('error');
      return;
    }
    
    if (profanityDetected) {
      setErrorMessage('Please remove inappropriate language');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setConfession('');
      setCategory('');
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 3000);
    }, 1500);
  };

  // Clear error message after 5 seconds
  useEffect(() => {
    if (submitStatus === 'error') {
      const timer = setTimeout(() => {
        setSubmitStatus(null);
        setErrorMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-36 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <motion.h2 
              className="text-3xl font-bold text-gray-900 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Share your secret anonymously
            </motion.h2>
            <motion.p 
              className="text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              No names, no login, just pure honesty.
            </motion.p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="confession" className="sr-only">Your confession</label>
              <motion.textarea
                id="confession"
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                placeholder="Write your confession here..."
                value={confession}
                onChange={handleConfessionChange}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              />
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span className={profanityDetected ? 'text-red-500' : ''}>
                  {profanityDetected ? 'Inappropriate language detected' : ''}
                </span>
                <span>
                  {confession.length}/500
                </span>
              </div>
            </div>

            <div className="mb-8">
              <motion.select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {categories.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </motion.select>
            </div>

            <motion.div
              className="mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-full shadow-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition ${isSubmitting ? 'bg-orange-400' : 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600'}`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Posting...
                  </>
                ) : (
                  <>
                    <FiSend className="mr-2" />
                    Post Confession
                  </>
                )}
              </button>
            </motion.div>

            <AnimatePresence>
              {submitStatus && (
                <motion.div
                  className={`p-4 mb-6 rounded-lg ${submitStatus === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center">
                    {submitStatus === 'success' ? (
                      <FiCheckCircle className="flex-shrink-0 h-5 w-5 mr-2" />
                    ) : (
                      <FiAlertCircle className="flex-shrink-0 h-5 w-5 mr-2" />
                    )}
                    <p>
                      {submitStatus === 'success' 
                        ? 'Your confession has been posted anonymously!' 
                        : errorMessage}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              className="text-center text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p>Remember: Don't share personal information.</p>
              <p>All confessions are completely anonymous.</p>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Post;