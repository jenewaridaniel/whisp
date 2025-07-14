import React from "react";
import { motion } from "framer-motion";
import {
  FiShield,
  FiEyeOff,
  FiLock,
  FiAlertTriangle,
  FiHeart,
} from "react-icons/fi";

const Privacy = () => {
//   const privacyPoints = [
//     {
//       icon: <FiEyeOff className="w-6 h-6" />,
//       title: "Total Anonymity",
//       description:
//         "We don't ask for your name or anything that can identify you. When you share here, no one knows it's you — promise!",
//     },
//     {
//       icon: <FiLock className="w-6 h-6" />,
//       title: "Data Protection",
//       description:
//         "We just keep your confessions so others can read and relate. We don't sell or share your content with anyone.",
//     },
//     {
//       icon: <FiShield className="w-6 h-6" />,
//       title: "Content Moderation",
//       description:
//         "We monitor for harmful content to keep Whisp safe. Dangerous or mean posts may be removed.",
//     },
//     {
//       icon: <FiAlertTriangle className="w-6 h-6" />,
//       title: "Safety First",
//       description:
//         "Please don't share personal details in your confessions. It's safer to keep things anonymous!",
//     },
//     {
//       icon: <FiHeart className="w-6 h-6" />,
//       title: "Safe Space",
//       description:
//         "Whisp is your private place to speak freely without worry. We're committed to maintaining this safe community.",
//     },
//   ];

  return (
    <div className="min-h-screen py-24 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <motion.header
        className="pt-24 pb-12 px-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Your{" "}
            <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Privacy
            </span>{" "}
            Matters
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            How we protect your anonymity and keep Whisp a safe space for honest
            sharing.
          </motion.p>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main
        className="pb-20 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Privacy Points */}
          {/* <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {privacyPoints.map((point, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 mb-4">
                  {point.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {point.title}
                </h3>
                <p className="text-gray-600">{point.description}</p>
              </motion.div>
            ))}
          </div> */}

          {/* Full Policy */}
          <motion.div
            className="bg-white rounded-xl shadow-sm p-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Our Privacy Promise
            </h2>
            <div className="space-y-6 text-gray-700">
              <p>
                <strong>Hey!</strong> We don't ask for your name or anything
                that can tell who you are. When you share your secrets here, no
                one knows it's you <strong className="">WE</strong> promise!
              </p>
              <p>
                We just keep your confessions so others can read and relate. We
                don't sell or share your stuff with anyone. Your thoughts stay
                between you and the Whisp community.
              </p>
              <p>
                We watch out for bad things and mean words to keep Whisp a safe
                spot. If you say something dangerous or mean, we might have to
                take it down. This isn't about censorship, but about protecting
                our community.
              </p>
              <p>
                <strong>Important:</strong> Please don't tell people your real
                name or where you live in your secrets it's safer that way!
                While we moderate content, we can't catch everything
                immediately.
              </p>
              <p className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r">
                Whisp is your private place to speak freely without worry. We're
                committed to maintaining this digital sanctuary where you can be
                your most honest self.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.main>

      {/* Footer Note */}
      <motion.footer
        className="bg-white py-8 border-t border-gray-200"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center text-gray-500">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </motion.footer>
    </div>
  );
};

export default Privacy;
