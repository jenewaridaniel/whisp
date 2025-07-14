import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { db } from "../config/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const Post = () => {
  const [confession, setConfession] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [profanityDetected, setProfanityDetected] = useState(false);
  const [detectedWords, setDetectedWords] = useState([]);

  // Comprehensive blocked words list (alphabetical order)
  const blockedWords = [
    // Racial/ethnic slurs
    "beaner",
    "chink",
    "coon",
    "dindu",
    "gook",
    "gypsy",
    "half-breed",
    "hick",
    "hillbilly",
    "jigaboo",
    "kike",
    "mick",
    "mulatto",
    "nigger",
    "nigga",
    "paki",
    "pickaninny",
    "porch monkey",
    "raghead",
    "redneck",
    "sambo",
    "slant-eye",
    "spic",
    "squaw",
    "tar baby",
    "towelhead",
    "tranny",
    "wetback",
    "white trash",

    // Gender/sexual orientation slurs
    "bitch",
    "butch",
    "dyke",
    "fag",
    "faggot",
    "fairy",
    "femme",
    "fruit",
    "homo",
    "lezzie",
    "limp wrist",
    "non-binaryphobic",
    "queer",
    "shemale",
    "sissy",
    "tranny",
    "twink",

    // Appearance/ability slurs
    "anorexic",
    "autist",
    "cripple",
    "deafie",
    "dumb",
    "fatass",
    "fatso",
    "freak",
    "gimp",
    "idiot",
    "imbecile",
    "lardass",
    "midget",
    "mongoloid",
    "moron",
    "obese",
    "retard",
    "retarded",
    "spaz",
    "spastic",
    "stupid",
    "ugly",
    "zitface",

    // Sexual/vulgar terms
    "anal",
    "anus",
    "areola",
    "arse",
    "arsehole",
    "ass",
    "asshole",
    "ball sack",
    "balls",
    "bastard",
    "bellend",
    "bestiality",
    "bimbo",
    "bint",
    "birdbrain",
    "blow job",
    "blowjob",
    "bollocks",
    "boner",
    "boob",
    "boobs",
    "breast",
    "bugger",
    "bum",
    "bunny boiler",
    "butt",
    "butthole",
    "buttplug",
    "clit",
    "clitoris",
    "cock",
    "coon",
    "cooter",
    "crap",
    "cum",
    "cunt",
    "dick",
    "dickhead",
    "dildo",
    "dong",
    "douche",
    "douchebag",
    "dumbass",
    "ejaculate",
    "erection",
    "fanny",
    "felching",
    "fellatio",
    "flange",
    "fuck",
    "fucker",
    "fucking",
    "genital",
    "goddamn",
    "god damn",
    "gooch",
    "handjob",
    "hell",
    "homo",
    "hooker",
    "hump",
    "jerk",
    "jerk-off",
    "jizz",
    "knob",
    "knob end",
    "labia",
    "muff",
    "naked",
    "nazi",
    "negro",
    "nigga",
    "nipple",
    "nude",
    "orgasm",
    "orgy",
    "penis",
    "piss",
    "pissed",
    "pissed off",
    "porn",
    "porno",
    "pornography",
    "prick",
    "pube",
    "pubes",
    "pussy",
    "queef",
    "rape",
    "rapist",
    "rectum",
    "rimjob",
    "schlong",
    "scrotum",
    "sex",
    "shag",
    "shemale",
    "shit",
    "shite",
    "skank",
    "slut",
    "smegma",
    "snatch",
    "spunk",
    "stripper",
    "tard",
    "testicle",
    "tit",
    "tits",
    "titties",
    "titty",
    "tosser",
    "turd",
    "twat",
    "vag",
    "vagina",
    "wank",
    "wanker",
    "whore",
    "willy",

    // Bullying/harmful phrases
    "kill yourself",
    "you should die",
    "nobody likes you",
    "you're worthless",
    "you're useless",
    "you're pathetic",
    "you're disgusting",
    "go die",
    "end it all",
    "you're a mistake",
    "you don't belong",
    "you're a loser",
    "you'll never succeed",
    "you're a failure",
    "no one cares",
    "you're better off dead",
  ];

  const categories = [
    { value: "", label: "Select a category (optional)" },
    { value: "relationship", label: "Relationship" },
    { value: "school", label: "School" },
    { value: "family", label: "Family" },
    { value: "work", label: "Work" },
    { value: "vent", label: "Vent" },
    { value: "other", label: "Other" },
  ];

  // Enhanced profanity detection with leet speak and common misspellings though never knew i could do this
  const checkForProfanity = (text) => {
    const leetMap = {
      a: ["4", "@", "á", "à", "â", "ã", "ä"],
      b: ["8", "|3", "ß"],
      e: ["3", "é", "è", "ê", "ë"],
      g: ["6", "9"],
      i: ["1", "!", "í", "ì", "î", "ï"],
      l: ["1", "|", "£"],
      o: ["0", "ó", "ò", "ô", "õ", "ö"],
      s: ["5", "$", "§"],
      t: ["7", "+"],
      z: ["2"],
    };

    const lowerText = text.toLowerCase();
    const words = lowerText.split(/\s+/);
    const foundWords = new Set();

    blockedWords.forEach((blockedWord) => {
      // Check for exact matches
      if (lowerText.includes(blockedWord)) {
        foundWords.add(blockedWord);
      }

      // Check for leet speak variations
      let pattern = blockedWord;
      for (const [char, replacements] of Object.entries(leetMap)) {
        if (blockedWord.includes(char)) {
          pattern = pattern.replace(
            new RegExp(char, "g"),
            `[${char}${replacements.join("")}]`
          );
        }
      }

      const regex = new RegExp(pattern, "i");
      if (regex.test(text)) {
        foundWords.add(blockedWord);
      }
    });

    return Array.from(foundWords);
  };

  const handleConfessionChange = (e) => {
    const text = e.target.value;
    if (text.length <= 500) {
      setConfession(text);

      // Check for profanity/bullying
      const detected = checkForProfanity(text);
      setDetectedWords(detected);
      setProfanityDetected(detected.length > 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!confession.trim()) {
      setErrorMessage("Please write your confession before submitting");
      setSubmitStatus("error");
      return;
    }

    if (profanityDetected) {
      setErrorMessage(
        `Please remove inappropriate language: ${detectedWords
          .slice(0, 3)
          .join(", ")}${detectedWords.length > 3 ? "..." : ""}`
      );
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Add confession to Firestore
      const docRef = await addDoc(collection(db, "posts"), {
        content: confession,
        category: category || "uncategorized",
        createdAt: serverTimestamp(),
        reactions: {
          like: 0,
          support: 0,
          hug: 0,
        },
        comments: [],
        approved: false, // For moderation
        reported: 0,
        flags: [],
      });



      setIsSubmitting(false);
      setSubmitStatus("success");
      setConfession("");
      setCategory("");
      setDetectedWords([]);
      setProfanityDetected(false);

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 3000);
    } catch (error) {
      console.error("Error adding document: ", error);
      setIsSubmitting(false);
      setErrorMessage("Failed to post confession. Please try again.");
      setSubmitStatus("error");
    }
  };

  // Clear error message after 5 seconds
  useEffect(() => {
    if (submitStatus === "error") {
      const timer = setTimeout(() => {
        setSubmitStatus(null);
        setErrorMessage("");
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
              <label htmlFor="confession" className="sr-only">
                Your confession
              </label>
              <motion.textarea
                id="confession"
                rows={8}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition ${
                  profanityDetected
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="Write your confession here..."
                value={confession}
                onChange={handleConfessionChange}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              />
              <div className="flex justify-between mt-2 text-sm">
                <span
                  className={
                    profanityDetected
                      ? "text-red-600 font-medium"
                      : "text-gray-500"
                  }
                >
                  {profanityDetected ? (
                    <>
                      <FiAlertCircle className="inline mr-1" />
                      {`Blocked words: ${detectedWords.slice(0, 2).join(", ")}${
                        detectedWords.length > 2 ? "..." : ""
                      }`}
                    </>
                  ) : (
                    "Keep it respectful and kind"
                  )}
                </span>
                <span className="text-gray-500">{confession.length}/500</span>
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
                disabled={isSubmitting || profanityDetected}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-full shadow-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition ${
                  isSubmitting
                    ? "bg-orange-400"
                    : profanityDetected
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
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
                  className={`p-4 mb-6 rounded-lg ${
                    submitStatus === "success"
                      ? "bg-green-50 text-green-800"
                      : "bg-red-50 text-red-800"
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center">
                    {submitStatus === "success" ? (
                      <FiCheckCircle className="flex-shrink-0 h-5 w-5 mr-2" />
                    ) : (
                      <FiAlertCircle className="flex-shrink-0 h-5 w-5 mr-2" />
                    )}
                    <p>
                      {submitStatus === "success"
                        ? "Your confession has been posted anonymously!"
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
              <p className="mb-1">Remember:</p>
              <ul className="list-disc list-inside text-left mx-auto max-w-xs">
                <li>Don't share personal information</li>
                <li>All confessions are anonymous</li>
                <li>Be kind to others</li>
                <li>No bullying or hate speech</li>
              </ul>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Post;

