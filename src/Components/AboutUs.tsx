import React, { useState, useEffect } from 'react';
import { Heart, Users, BookOpen, Download, Shield, Clock, Award, Sparkles, ArrowRight, CheckCircle, Crown } from 'lucide-react';
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
      title: "Completely Free",
      description: "We believe memorial creation should be accessible to everyone. All our features and templates are 100% free - no hidden costs or premium tiers."
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
      description: "Grief is a journey best traveled together. We foster a supportive community where families can share, remember, and find comfort in shared experiences - all for free."
    }
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Digital Memorial Pages",
      description: "Create beautiful, personalized memorial pages that tell your loved one's unique story with photos, videos, and cherished memories - completely free."
    },
    {
      icon: Download,
      title: "Download PDF History",
      description: "Download a comprehensive PDF of your loved one's history - a beautifully formatted document you can print, share via links, or scan QR codes for easy access - no cost."
    },
    {
      icon: Clock,
      title: "Life Timeline",
      description: "Chronicle the significant moments and milestones that made your loved one's journey special, creating a visual celebration of their life - free forever."
    },
    {
      icon: Users,
      title: "Memory Wall",
      description: "Invite family and friends to share their stories, condolences, and favorite memories, building a collective tribute that honors your loved one - 100% free."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Families Served", data: "Helping families create meaningful tributes across 50+ countries for free" },
    { number: "50,000+", label: "Memories Shared", data: "Stories, photos, and cherished moments preserved forever at no cost" },
    { number: "15,000+", label: "Templates Downloaded", data: "Professional designs for obituaries, programs, and memory books - all free" }
  ];

  const journey = [
    {
      year: "2023",
      title: "The Beginning",
      description: "4revah was born from a personal experience of loss and the realization that creating meaningful memorials should be completely free and accessible to all."
    },
    {
      year: "2024",
      title: "Growing Together",
      description: "We expanded our template library and introduced collaborative features - all for free, allowing families worldwide to come together in remembrance."
    },
    {
      year: "2025",
      title: "Today & Beyond",
      description: "We continue to innovate, adding new features and templates while staying true to our mission: making memorial creation free, beautiful, and meaningful for everyone."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/30 to-gray-50/20">
      <TopNav/>
      
      {/* Hero Section - REDUCED SPACING */}
      <section id="about-4revah" className="relative overflow-hidden bg-gradient-to-br from-orange-600/90 via-orange-500/90 to-amber-600/90 text-white py-10 sm:py-14 lg:py-16">
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
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full mb-3">
              <Crown className="w-4 h-4 fill-white" />
              <span className="text-sm font-semibold">Completely Free</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight">
              Honoring Lives, Preserving Legacies
            </h1>
            
            <p className="text-base text-white/90 mb-4 leading-relaxed">
              We believe every life tells a unique story worth celebrating. 4revah helps families create beautiful, lasting tributes that honor loved ones and keep their memories alive forever - 100% free.
            </p>
            
            <div className="flex justify-center">
              <button className="px-5 py-2.5 bg-white text-orange-600 rounded-lg font-bold text-base hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-auto">
                Start Creating Free
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section - REDUCED SPACING */}
      <section id="mission" className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full">
                <Heart className="w-3 h-3 fill-slate-700" />
                <span className="text-sm font-semibold">Our Mission</span>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                Making Memorial Creation Free, Beautiful & Meaningful
              </h2>
              
              <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
                <p>
                  At 4revah, we understand that losing a loved one is one of life's most difficult experiences. In those moments of grief, the last thing families should worry about is complicated software or expensive memorial services.
                </p>
                <p>
                  That's why we created a completely free platform that combines simplicity with beauty—where you can create stunning digital memorials, download professional templates, and bring family and friends together to celebrate a life well-lived - all at no cost.
                </p>
                <p className="font-semibold text-orange-600">
                  Every memorial tells a story. We're here to help you tell it beautifully - for free.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 pt-2">
                <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-lg">
                  <Crown className="w-4 h-4 text-orange-600" />
                  <span className="font-semibold text-orange-800 text-sm">100% Free Forever</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-slate-600" />
                  <span className="font-semibold text-gray-800 text-sm">Easy to Use</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-slate-600" />
                  <span className="font-semibold text-gray-800 text-sm">Always Accessible</span>
                </div>
              </div>
            </div>
            
            <div className="relative mt-6 lg:mt-0">
              <div className="aspect-square rounded-xl bg-gradient-to-br from-slate-400 to-slate-600 p-1 shadow-lg">
                <div className="w-full h-full bg-white rounded-lg p-4 flex flex-col justify-center items-center text-center space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-400 to-slate-600 blur-2xl opacity-30 animate-pulse"></div>
                    <Heart className="w-12 h-12 text-slate-600 fill-slate-600 relative" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Forever in Memory</h3>
                    <p className="text-gray-600 text-sm">Celebrating lives, one story at a time</p>
                  </div>
                  <div className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                    <Crown className="w-3 h-3 fill-orange-600" />
                    <span className="text-xs font-semibold">Completely Free</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section - REDUCED SPACING */}
      <section id="values" className="py-10 bg-gradient-to-b from-slate-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full mb-3">
              <Award className="w-3 h-3" />
              <span className="text-sm font-semibold">Our Values</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              What Drives Us
            </h2>
            <p className="text-sm text-gray-600">
              The principles that guide everything we do at 4revah - completely free
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div 
                  key={index}
                  className="group bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border-2 border-slate-100 hover:border-slate-300 hover:-translate-y-1"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-400 to-slate-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section - REDUCED SPACING */}
      <section id="features" className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full mb-3">
              <Sparkles className="w-3 h-3" />
              <span className="text-sm font-semibold">What We Offer</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Everything You Need to Honor a Life - Free
            </h2>
            <p className="text-sm text-gray-600">
              Comprehensive tools and templates designed with love and care - 100% free
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="group bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-4 hover:shadow-lg transition-all duration-300 border-2 border-slate-200/50 hover:border-slate-300"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-700 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-gray-900 mb-1.5">{feature.title}</h3>
                      <p className="text-gray-700 leading-relaxed text-sm">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section - REDUCED SPACING */}
      <section className="py-10 bg-gradient-to-br from-orange-600/90 via-orange-500/90 to-amber-600/90 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }}
        ></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold mb-3">Trusted by Families Worldwide</h2>
            <p className="text-sm text-white/90">Making a difference, one memorial at a time - all free</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-lg font-bold mb-1">{stat.number}</div>
                <div className="text-sm text-white/90 font-medium mb-1">{stat.label}</div>
                <div className="text-xs text-white/80 leading-relaxed">{stat.data}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Section - REDUCED SPACING */}
      <section id="journey" className="py-10 bg-gradient-to-b from-white to-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full mb-3">
              <Clock className="w-3 h-3" />
              <span className="text-sm font-semibold">Our Journey</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              How We Got Here
            </h2>
            <p className="text-sm text-gray-600">
              The story of 4revah and our commitment to serving families for free
            </p>
          </div>
          
          <div className="space-y-4">
            {journey.map((milestone, index) => (
              <div 
                key={index}
                className="flex flex-col lg:flex-row gap-4 items-start lg:items-center"
              >
                <div className="flex-shrink-0 w-20">
                  <div className="text-2xl font-extrabold text-transparent bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text">
                    {milestone.year}
                  </div>
                </div>
                <div className="flex-1 bg-white rounded-xl p-4 shadow-md border-2 border-slate-100 hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{milestone.title}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - REDUCED SPACING */}
      <section className="py-10 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        ></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-10 h-10 mx-auto mb-3 fill-white animate-pulse" />
          <h2 className="text-xl font-bold mb-3">
            Ready to Honor Your Loved One for Free?
          </h2>
          <p className="text-sm text-white/90 mb-4 leading-relaxed">
            Join thousands of families who trust 4revah to create beautiful, lasting memorials. Start your journey today—it's completely free.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button className="px-5 py-2.5 bg-white text-slate-800 rounded-lg font-bold text-base hover:bg-slate-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-auto">
              Create Free Memorial
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-lg font-bold text-base hover:bg-white/20 transition-all duration-300 border-2 border-white/30 hover:border-white/50 w-full sm:w-auto">
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