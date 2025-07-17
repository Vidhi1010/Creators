"use client";
import { db } from "@/lib/firebase"; // Adjust path based on your file structure
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
// Using fetch instead of axios for better compatibility
import React, { useState, useEffect } from "react";
import { 
  MessageCircle, 
  BarChart3, 
  Users, 
  Zap, 
  Mail, 
  User, 
  Check, 
  Heart,
  Star,
  Sparkles,
  Video,
  AlertTriangle,
  X
} from "lucide-react";

// Toast Component
const Toast = ({ message, type, onClose }: { message: string; type: 'error' | 'success' | 'warning'; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'error':
        return 'from-red-500/20 to-pink-500/20 border-red-400/30 text-red-300';
      case 'success':
        return 'from-green-500/20 to-blue-500/20 border-green-400/30 text-green-300';
      case 'warning':
        return 'from-yellow-500/20 to-orange-500/20 border-yellow-400/30 text-yellow-300';
      default:
        return 'from-blue-500/20 to-purple-500/20 border-blue-400/30 text-blue-300';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'success':
        return <Check className="w-5 h-5 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-right duration-300">
      <div className={`flex items-center space-x-3 p-4 bg-gradient-to-r ${getToastStyles()} backdrop-blur border rounded-2xl shadow-2xl max-w-sm`}>
        {getIcon()}
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const SayHiveWaitlist: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(12847);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' | 'warning' } | null>(null);

  // Animate waitlist counter
  useEffect(() => {
    const interval = setInterval(() => {
      setWaitlistCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (message: string, type: 'error' | 'success' | 'warning') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Step 1: Validate Email with Abstract API
      const response = await fetch(
        `https://emailvalidation.abstractapi.com/v1/?api_key=54bd358a7e4b4226a94fa0af0dcf9cdf&email=${email}`
      );
      const data = await response.json();
      
      const isValid = 
        data.deliverability === "DELIVERABLE" &&
        data.is_smtp_valid.value === true &&
        data.is_mx_found.value === true;

      if (!isValid) {
        showToast("This email doesn't appear to be valid. Please check and try again.", "warning");
        setIsLoading(false);
        return;
      }

      // Step 2: Save to Firebase Firestore
      await addDoc(collection(db, "waitlist"), {
        name,
        email,
        createdAt: serverTimestamp()
      });

      // Step 3: UI Update
      setIsSubmitted(true);
      showToast("Welcome to the hive! You're now on our waitlist.", "success");
      setIsLoading(false);
    } catch (error) {
      console.error("Submission error:", error);
      showToast("Something went wrong while submitting. Please try again.", "error");
      setIsLoading(false);
    }
  };

  const FloatingIcon = ({ children, className = "", delay = "0s" }: any) => (
    <div 
      className={`absolute opacity-20 animate-pulse ${className}`}
      style={{ animationDelay: delay }}
    >
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white-800 via-white-800 to-white-800 text-white relative overflow-hidden">
      
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={hideToast} 
        />
      )}
      
      {/* Floating Background Icons */}
      <FloatingIcon className="top-20 left-10" delay="0s">
        <MessageCircle className="w-12 h-12 text-blue-400" />
      </FloatingIcon>
      <FloatingIcon className="top-32 right-20" delay="1s">
        <Heart className="w-10 h-10 text-pink-400" />
      </FloatingIcon>
      <FloatingIcon className="bottom-40 left-20" delay="2s">
        <BarChart3 className="w-14 h-14 text-green-400" />
      </FloatingIcon>
      <FloatingIcon className="top-60 right-40" delay="1.5s">
        <Sparkles className="w-8 h-8 text-yellow-400" />
      </FloatingIcon>
      <FloatingIcon className="bottom-60 right-10" delay="0.5s">
        <Star className="w-11 h-11 text-purple-400" />
      </FloatingIcon>
      
      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
            <MessageCircle className="w-7 h-7 text-white" />
          </div>
          <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            SayHive
          </span>
        </div>
      </header>
      
      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-8 mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-300 text-sm font-medium">
            <Zap className="w-4 h-4 mr-2" />
            Next-Gen Social Platform
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Where every voice
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              shapes the buzz
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            The first social platform that combines Twitter-like conversations with instant polling. 
            See what everyone really thinks, not just who shouts the loudest.
          </p>
          
          {/* Waitlist Form */}
          <div className="max-w-md mx-auto space-y-6 mt-12">
            {!isSubmitted ? (
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur border border-white/20 rounded-2xl focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all placeholder-gray-400 text-white"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur border border-white/20 rounded-2xl focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all placeholder-gray-400 text-white"
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !name.trim() || !email.trim()}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 rounded-2xl font-bold text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-2xl"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Joining the Buzz...</span>
                    </div>
                  ) : (
                    "Join the Buzz 🚀"
                  )}
                </button>
              </div>
            ) : (
              <div className="p-6 bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur border border-green-400/30 rounded-2xl">
                <div className="flex items-center justify-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-400">Welcome to the hive!</h3>
                </div>
                <p className="text-gray-300 text-lg text-center">
                  You're in! We'll buzz you when it's time to join the conversation.
                </p>
              </div>
            )}
            
            <p className="text-sm text-gray-400 text-center">
              Join <span className="font-semibold text-blue-400">{waitlistCount.toLocaleString()}</span> people waiting • No spam, just the buzz
            </p>
          </div>
        </div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {[
            {
              icon: <BarChart3 className="w-8 h-8" />,
              title: "Built-in Polling",
              description: "Every post can have a poll. See instant public opinion, not just comments."
            },
            {
              icon: <MessageCircle className="w-8 h-8" />,
              title: "Real-time Buzz",
              description: "Lightning-fast conversations that matter. Stay in the loop as it happens."
            },
            {
              icon: <Zap className="w-8 h-8" />,
              title: "AI-Powered Insights",
              description: "Smart algorithms surface the opinions and trends that actually matter."
            },
            {
              icon: <Users className="w-8 h-8" />,
              title: "Community Voice",
              description: "Democracy in action. Every vote counts, every voice shapes the narrative."
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
        
        {/* Social Proof */}
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 mb-20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Trusted by forward-thinkers</h2>
            <p className="text-gray-400">Join creators, journalists, and opinion leaders who are ready for change</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Finally, a platform where we can actually measure public sentiment instead of guessing from comments.",
                author: "Sarah Chen",
                role: "Political Journalist"
              },
              {
                quote: "SayHive is going to change how we understand what people really think about the news.",
                author: "Marcus Rodriguez",
                role: "Content Creator"
              },
              {
                quote: "The polling feature is genius. It's like having a focus group for every conversation.",
                author: "Dr. Elena Kim",
                role: "Social Media Researcher"
              }
            ].map((testimonial, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold">
                  {testimonial.author.split(' ').map(n => n[0]).join('')}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold text-white">{testimonial.author}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-20">
          <div>
            <div className="text-4xl font-bold text-blue-400 mb-2">{waitlistCount.toLocaleString()}</div>
            <div className="text-gray-400">On Waitlist</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-400 mb-2">50+</div>
            <div className="text-gray-400">Beta Testers</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-pink-400 mb-2">98%</div>
            <div className="text-gray-400">Satisfaction Rate</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-400 mb-2">24/7</div>
            <div className="text-gray-400">Community Support</div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-gray-400 text-sm">© 2025 SayHive. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SayHiveWaitlist;