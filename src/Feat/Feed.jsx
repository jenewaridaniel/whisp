import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMessageSquare,
  FiSend,
  FiHeart,
  FiShare2,
  FiBookmark,
} from "react-icons/fi";
import { db } from "../config/firebase";
import confetti from "canvas-confetti";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
  getDoc,
} from "firebase/firestore";
import EmojiPicker from "emoji-picker-react";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState("");
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [isScrolled, setIsScrolled] = useState(false);
  const [userReactions, setUserReactions] = useState({});

  const commentInputRef = useRef(null);
  const feedRef = useRef(null);

  // Categories for filtering
  const categories = [
    { id: "all", name: "All Whispers" },
    { id: "confession", name: "Confessions" },
    { id: "secret", name: "Secrets" },
    { id: "rant", name: "Rants" },
    { id: "compliment", name: "Compliments" },
  ];

  // Load user reactions from localStorage
  useEffect(() => {
    const savedReactions = localStorage.getItem("whisperWallReactions");
    if (savedReactions) {
      setUserReactions(JSON.parse(savedReactions));
    }
  }, []);

  // Save user reactions to localStorage
  useEffect(() => {
    localStorage.setItem("whisperWallReactions", JSON.stringify(userReactions));
  }, [userReactions]);

  // Fetch posts from Firestore
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsData = [];
      querySnapshot.forEach((doc) => {
        postsData.push({ id: doc.id, ...doc.data() });
      });
      setPosts(postsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Handle scroll for header effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchComments = (postId) => {
    const q = query(
      collection(db, "posts", postId, "comments"),
      orderBy("timestamp", "asc")
    );
    onSnapshot(q, (querySnapshot) => {
      const commentsData = [];
      querySnapshot.forEach((doc) => {
        commentsData.push({ id: doc.id, ...doc.data() });
      });
      setComments((prev) => ({ ...prev, [postId]: commentsData }));
    });
  };

  const handleReaction = async (postId, emoji) => {
    const postRef = doc(db, "posts", postId);
    const postDoc = await getDoc(postRef);
    const currentReactions = postDoc.data()?.reactions || {};

    try {
      // If user already reacted to this post
      if (userReactions[postId]) {
        const previousEmoji = userReactions[postId];

        // Remove previous reaction if clicking different emoji
        if (previousEmoji !== emoji) {
          await updateDoc(postRef, {
            [`reactions.${previousEmoji}`]: increment(-1),
            [`reactions.${emoji}`]: increment(1),
          });
          // Update local state with new reaction
          setUserReactions((prev) => ({
            ...prev,
            [postId]: emoji,
          }));
        }
        // If same emoji clicked again, remove reaction
        else {
          await updateDoc(postRef, {
            [`reactions.${emoji}`]: increment(-1),
          });
          // Remove reaction from local state
          setUserReactions((prev) => {
            const newReactions = { ...prev };
            delete newReactions[postId];
            return newReactions;
          });
          return;
        }
      }
      // New reaction
      else {
        await updateDoc(postRef, {
          [`reactions.${emoji}`]: increment(1),
        });
        // Add reaction to local state
        setUserReactions((prev) => ({
          ...prev,
          [postId]: emoji,
        }));
      }

      // Confetti effect for new/changed reactions
      triggerConfetti(emoji);
    } catch (error) {
      console.error("Error updating reaction:", error);
    }
    setShowEmojiPicker(null);
  };

  const triggerConfetti = (emoji) => {
    if (emoji === "❤️" || emoji === "🔥") {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#ff0000", "#ff7700"],
      });
    } else if (emoji === "🎉") {
      confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.6 },
        shapes: ["circle", "star"],
      });
    } else {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleAddComment = async (postId) => {
    const trimmedComment = newComment.trim();
    if (!trimmedComment) return;
    try {
      await addDoc(collection(db, "posts", postId, "comments"), {
        content: trimmedComment,
        timestamp: serverTimestamp(),
        author: "Anonymous",
      });
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const toggleComments = (postId) => {
    if (activeCommentPost === postId) {
      setActiveCommentPost(null);
    } else {
      setActiveCommentPost(postId);
      if (!comments[postId]) fetchComments(postId);
      setTimeout(() => commentInputRef.current?.focus(), 300);
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (activeTab === "all") return true;
    return post.category === activeTab;
  });

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const renderPostActions = (post) => {
    const userReaction = userReactions[post.id];
    const reactions = post.reactions || {};

    return (
      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <div className="flex items-center space-x-1">
          {Object.entries(reactions)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([emoji, count]) => (
              <motion.button
                key={emoji}
                onClick={() => handleReaction(post.id, emoji)}
                className={`text-sm rounded-full px-2 py-1 flex items-center transition ${
                  userReaction === emoji
                    ? "bg-purple-100 text-purple-600"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-1">{emoji}</span>
                <span>{count}</span>
              </motion.button>
            ))}
        </div>

        <div className="flex items-center space-x-4">
          <motion.button
            onClick={() => handleReaction(post.id, "❤️")}
            className={`flex items-center transition ${
              userReaction === "❤️"
                ? "text-pink-500"
                : "text-gray-500 hover:text-pink-500"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiHeart className="mr-1" />
            <span className="text-sm hidden sm:inline">Love</span>
          </motion.button>

          <button
            onClick={() =>
              setShowEmojiPicker(showEmojiPicker === post.id ? null : post.id)
            }
            className="flex items-center text-gray-500 hover:text-purple-500 transition"
          >
            <span className="text-xl">😊</span>
            <span className="ml-1 text-sm hidden sm:inline">React</span>
          </button>

          <button
            onClick={() => toggleComments(post.id)}
            className="flex items-center text-gray-500 hover:text-blue-500 transition"
          >
            <FiMessageSquare className="mr-1" />
            <span className="text-sm hidden sm:inline">Comment</span>
          </button>

          <button className="flex items-center text-gray-500 hover:text-green-500 transition">
            <FiShare2 className="mr-1" />
            <span className="text-sm hidden sm:inline">Share</span>
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 animate-spin"></div>
          <p className="text-gray-600">Loading whispers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 pb-20">
      {/* Floating Header */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-20 backdrop-blur-md transition-all duration-300 ${
          isScrolled ? "py-2 shadow-sm" : "py-4"
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <motion.h1
              className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 transition-all ${
                isScrolled ? "text-xl" : "text-2xl"
              }`}
              whileHover={{ scale: 1.02 }}
            >
              Whisper Wall
            </motion.h1>
            <button
              className="px-4 py-2 bg-white rounded-full shadow-sm text-sm font-medium text-purple-600 hover:bg-purple-50 transition"
              whileHover={{ scale: 1.05 }}
            >
              Post a Whisper
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-28">
        {/* Category Tabs */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  activeTab === category.id
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Posts */}
        {filteredPosts.length === 0 ? (
          <motion.div
            className="text-center py-12 bg-white rounded-2xl shadow-sm p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-6xl mb-4">🦉</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              {activeTab === "all"
                ? "The wall is quiet..."
                : `No ${activeTab}s yet`}
            </h3>
            <p className="text-gray-500">
              {activeTab === "all"
                ? "Be the first to share your whisper!"
                : `Be the first to share a ${activeTab}!`}
            </p>
            <button className="mt-6 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-md hover:shadow-lg transition">
              Share Your Whisper
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6" ref={feedRef}>
            {filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                layout
                whileHover={{ scale: 1.005 }}
              >
                <div className="p-6">
                  {post.category && (
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-purple-600 bg-purple-100 rounded-full mb-3">
                      {post.category}
                    </span>
                  )}

                  <p className="text-gray-800 whitespace-pre-line mb-4 text-lg font-light leading-relaxed">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>
                      {post.createdAt?.toDate().toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }) || "Just now"}
                    </span>
                    <div className="flex items-center space-x-2">
                      {Object.values(post.reactions || {}).reduce(
                        (a, b) => a + b,
                        0
                      ) > 0 && (
                        <span className="flex items-center">
                          <FiHeart className="mr-1 text-pink-400" size={14} />
                          {Object.values(post.reactions || {}).reduce(
                            (a, b) => a + b,
                            0
                          )}
                        </span>
                      )}
                      <span>•</span>
                      <span className="flex items-center">
                        <FiMessageSquare
                          className="mr-1 text-blue-400"
                          size={14}
                        />
                        {comments[post.id]?.length || 0}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {renderPostActions(post)}

                  {/* Emoji Picker */}
                  <AnimatePresence>
                    {showEmojiPicker === post.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-4"
                      >
                        <EmojiPicker
                          onEmojiClick={(emojiData) =>
                            handleReaction(post.id, emojiData.emoji)
                          }
                          width="100%"
                          height={300}
                          searchDisabled
                          skinTonesDisabled
                          previewConfig={{ showPreview: false }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Comments Section */}
                <AnimatePresence>
                  {activeCommentPost === post.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gray-50 border-t border-gray-100"
                    >
                      <div className="p-4">
                        <div className="flex mb-4">
                          <input
                            type="text"
                            ref={commentInputRef}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyPress={(e) =>
                              e.key === "Enter" && handleAddComment(post.id)
                            }
                            placeholder="Whisper a reply..."
                            className="flex-1 px-4 py-3 border-0 rounded-l-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white shadow-sm"
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-r-lg hover:from-purple-600 hover:to-pink-600 transition flex items-center disabled:opacity-50"
                            disabled={!newComment.trim()}
                          >
                            <FiSend />
                          </button>
                        </div>

                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                          {comments[post.id]?.length > 0 ? (
                            comments[post.id].map((comment) => (
                              <motion.div
                                key={comment.id}
                                className="bg-white p-4 rounded-lg shadow-xs"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="flex items-start">
                                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center mr-3 flex-shrink-0">
                                    <span className="text-lg">👤</span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="font-medium text-gray-700 truncate">
                                        Anonymous
                                      </span>
                                      <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                        {comment.timestamp
                                          ?.toDate()
                                          .toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          }) || "Now"}
                                      </span>
                                    </div>
                                    <p className="text-gray-800 break-words">
                                      {comment.content}
                                    </p>
                                    <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                                      {/* <button className="flex items-center hover:text-pink-500">
                                        <FiHeart size={12} className="mr-1" />
                                        <span>12</span>
                                      </button> */}
                                      {/* <button className="flex items-center hover:text-blue-500">
                                        <FiMessageSquare
                                          size={12}
                                          className="mr-1"
                                        />
                                        <span>Reply</span>
                                      </button> */}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))
                          ) : (
                            <motion.div
                              className="text-center py-6"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              <p className="text-gray-500">
                                No whispers yet... be the first!
                              </p>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-white w-12 h-12 rounded-full shadow-xl flex items-center justify-center text-purple-600 hover:bg-purple-50 transition"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        ↑
      </motion.button>

      {/* Bottom Navigation (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 flex justify-around sm:hidden z-10">
        <button className="p-2 text-purple-600">
          <FiMessageSquare size={20} />
        </button>
        <button className="p-2 text-gray-500 hover:text-purple-600">
          <FiHeart size={20} />
        </button>
        <button className="p-2 text-gray-500 hover:text-purple-600">
          <FiBookmark size={20} />
        </button>
        <button className="p-2 text-gray-500 hover:text-purple-600">
          <FiShare2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default Feed;
