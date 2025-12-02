import React, { useState, useEffect } from 'react';
import { Heart, Users, BookOpen, Download, Shield, Clock, Award, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import TopNav from '../Components/TopNav';
import {Footer} from '../Components/Footer';

const AboutUs: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const values = [
    {
      icon: Heart,
      title: "Compassion First",
      description: "We understand the profound loss of losing a loved one. Every feature we build is designed with empathy, respect, and care for those who are grieving."
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Your memories are sacred. We employ industry-leading security measures to ensure your loved one's legacy is protected and accessible only to those you choose."
    },
    {
      icon: Sparkles,
      title: "Timeless Quality",
      description: "We believe every life deserves to be celebrated beautifully. Our templates and tools are crafted with attention to detail, creating memorials worthy of the lives they honor."
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Grief is a journey best traveled together. We foster a supportive community where families can share, remember, and find comfort in shared experiences."
    }
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Digital Memorial Pages",
      description: "Create beautiful, personalized memorial pages that tell your loved one's unique story with photos, videos, and cherished memories."
    },
    {
      icon: Download,
      title: "Download PDF History",
      description: "Download a comprehensive PDF of your loved one's history - a beautifully formatted document you can print, share via links, or scan QR codes for easy access."
    },
    {
      icon: Clock,
      title: "Life Timeline",
      description: "Chronicle the significant moments and milestones that made your loved one's journey special, creating a visual celebration of their life."
    },
    {
      icon: Users,
      title: "Memory Wall",
      description: "Invite family and friends to share their stories, condolences, and favorite memories, building a collective tribute that honors your loved one."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Families Served", data: "Helping families create meaningful tributes across 50+ countries" },
    { number: "50,000+", label: "Memories Shared", data: "Stories, photos, and cherished moments preserved forever" },
    { number: "15,000+", label: "Templates Downloaded", data: "Professional designs for obituaries, programs, and memory books" }
  ];

  const journey = [
    {
      year: "2023",
      title: "The Beginning",
      description: "4revah was born from a personal experience of loss and the realization that creating meaningful memorials shouldn't be complicated or expensive."
    },
    {
      year: "2024",
      title: "Growing Together",
      description: "We expanded our template library and introduced collaborative features, allowing families worldwide to come together in remembrance."
    },
    {
      year: "2025",
      title: "Today & Beyond",
      description: "We continue to innovate, adding new features and templates while staying true to our mission: making memorial creation accessible, beautiful, and meaningful."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/30 to-gray-50/20">
      <TopNav/>
      
      {/* Hero Section */}
      <section id="about-4revah" className="relative overflow-hidden bg-gradient-to-br from-orange-600/90 via-orange-500/90 to-amber-600/90 text-white py-16 sm:py-20 lg:py-28 xl:py-32">
        <div className="absolute inset-0 bg-black/10"></div>
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
            transform: `translateY(${scrollY * 0.3}px)`
          }}
        ></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-6 animate-fade-in">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
              <span className="text-xs sm:text-sm font-semibold">About 4revah</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 leading-tight animate-slide-up px-4">
              Honoring Lives, Preserving Legacies
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 leading-relaxed animate-slide-up px-4" style={{ animationDelay: '0.1s' }}>
              We believe every life tells a unique story worth celebrating. 4revah helps families create beautiful, lasting tributes that honor loved ones and keep their memories alive forever.
            </p>
            
            <div className="flex justify-center animate-slide-up px-4" style={{ animationDelay: '0.2s' }}>
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-orange-600 rounded-xl font-bold text-base sm:text-lg hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-auto">
                Start Creating
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-12 sm:py-16 lg:py-20 xl:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
            <div className="space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 fill-slate-700" />
                <span className="text-xs sm:text-sm font-semibold">Our Mission</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Making Memorial Creation Simple, Beautiful & Meaningful
              </h2>
              
              <div className="space-y-3 sm:space-y-4 text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed">
                <p>
                  At 4revah, we understand that losing a loved one is one of life's most difficult experiences. In those moments of grief, the last thing families should worry about is complicated software or expensive memorial services.
                </p>
                <p>
                  That's why we created a platform that combines simplicity with beauty—where you can create stunning digital memorials, download professional templates, and bring family and friends together to celebrate a life well-lived.
                </p>
                <p className="font-semibold text-slate-700">
                  Every memorial tells a story. We're here to help you tell it beautifully.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 sm:gap-3 pt-2 sm:pt-4">
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                  <span className="font-semibold text-gray-800 text-xs sm:text-sm lg:text-base">Free to Start</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                  <span className="font-semibold text-gray-800 text-xs sm:text-sm lg:text-base">Easy to Use</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                  <span className="font-semibold text-gray-800 text-xs sm:text-sm lg:text-base">Always Accessible</span>
                </div>
              </div>
            </div>
            
            <div className="relative mt-8 lg:mt-0">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-slate-400 to-slate-600 p-1 shadow-2xl">
                <div className="w-full h-full bg-white rounded-xl p-6 sm:p-8 flex flex-col justify-center items-center text-center space-y-4 sm:space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-400 to-slate-600 blur-2xl opacity-30 animate-pulse"></div>
                    <Heart className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-slate-600 fill-slate-600 relative" />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Forever in Memory</h3>
                    <p className="text-gray-600 text-base sm:text-lg">Celebrating lives, one story at a time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section id="values" className="py-12 sm:py-16 lg:py-20 xl:py-24 bg-gradient-to-b from-slate-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-3 sm:mb-4">
              <Award className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-semibold">Our Values</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              What Drives Us
            </h2>
            <p className="text-base sm:text-lg text-gray-600 px-4">
              The principles that guide everything we do at 4revah
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div 
                  key={index}
                  className="group bg-white rounded-2xl p-5 sm:p-6 lg:p-8 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-slate-100 hover:border-slate-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-slate-400 to-slate-600 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 lg:py-20 xl:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-3 sm:mb-4">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-semibold">What We Offer</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              Everything You Need to Honor a Life
            </h2>
            <p className="text-base sm:text-lg text-gray-600 px-4">
              Comprehensive tools and templates designed with love and care
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="group bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-5 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300 border-2 border-slate-200/50 hover:border-slate-300"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-slate-500 to-slate-700 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5 sm:mb-2">{feature.title}</h3>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-orange-600/90 via-orange-500/90 to-amber-600/90 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }}
        ></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">Trusted by Families Worldwide</h2>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 px-4">Making a difference, one memorial at a time</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                <div className="text-base sm:text-lg lg:text-xl text-white/90 font-medium mb-2 sm:mb-3">{stat.label}</div>
                <div className="text-xs sm:text-sm lg:text-base text-white/80 leading-relaxed">{stat.data}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section id="journey" className="py-12 sm:py-16 lg:py-20 xl:py-24 bg-gradient-to-b from-white to-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-3 sm:mb-4">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-semibold">Our Journey</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              How We Got Here
            </h2>
            <p className="text-base sm:text-lg text-gray-600 px-4">
              The story of 4revah and our commitment to serving families
            </p>
          </div>
          
          <div className="space-y-6 sm:space-y-8 lg:space-y-12">
            {journey.map((milestone, index) => (
              <div 
                key={index}
                className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-12 items-start lg:items-center"
              >
                <div className="flex-shrink-0 w-24 sm:w-32 lg:w-40">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text">
                    {milestone.year}
                  </div>
                </div>
                <div className="flex-1 bg-white rounded-2xl p-5 sm:p-6 lg:p-8 shadow-md border-2 border-slate-100 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">{milestone.title}</h3>
                  <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 xl:py-24 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        ></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto mb-4 sm:mb-6 fill-white animate-pulse" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 px-4">
            Ready to Honor Your Loved One?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 leading-relaxed px-4">
            Join thousands of families who trust 4revah to create beautiful, lasting memorials. Start your journey today—it's free to begin.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <button className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-slate-800 rounded-xl font-bold text-base sm:text-lg hover:bg-slate-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-auto">
              Create Memorial
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button className="px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold text-base sm:text-lg hover:bg-white/20 transition-all duration-300 border-2 border-white/30 hover:border-white/50 w-full sm:w-auto">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AboutUs;