import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  Users, 

  CheckCircle,
  ArrowRight,
  Camera,
  Calendar,
  MapPin,
  BookOpen,
  Clock,
  Sparkles,
  User,
  Crown,

} from 'lucide-react';
import TopNav from '../Components/TopNav';
import { Footer } from '../Components/Footer';
import { useNavigate } from 'react-router-dom';

const WhatWeOffer: React.FC = () => {
  const [activeStep] = useState(1);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/');
  };

  const services = [
    {
      icon: BookOpen,
      title: "Digital Memorial Creation",
      description: "Create beautiful, personalized digital memorial pages with photos, stories, and memories of your loved one.",
      features: ["Unlimited photos", "Life story section", "Memory wall", "Timeline of life events"]
    },
    {
      icon: FileText,
      title: "PDF Memorial Book",
      description: "Download a professionally designed PDF memorial book that you can print, share, or keep as a digital keepsake.",
      features: ["Multiple templates", "High-quality print", "Customizable layout", "Family tree section"]
    },
    {
      icon: Users,
      title: "Family Collaboration",
      description: "Invite family members to contribute memories, photos, and stories to create a comprehensive tribute together.",
      features: ["Multi-user access", "Real-time updates", "Moderation controls", "Private sharing"]
    }
  ];

  const steps = [
    {
      step: 1,
      icon: BookOpen,
      title: "Register Free",
      description: "Create your free account and get your first memorial template absolutely free"
    },
    {
      step: 2,
      title: "Create Memorial",
      icon: User,
      description: "Fill in details about your loved one - name, photos, life story, and special memories"
    },
    {
      step: 3,
      title: "Design & Preview",
      icon: Sparkles,
      description: "Choose from beautiful templates and preview your memorial"
    },
    {
      step: 4,
      title: "Download & Share",
      icon: Download,
      description: "Download your high-quality PDF and share with family and friends"
    }
  ];

  const memorialFormFields = [
    { name: 'fullName', label: 'Full Name', type: 'text', icon: User },
    { name: 'birthDate', label: 'Date of Birth', type: 'date', icon: Calendar },
    { name: 'passingDate', label: 'Date of Passing', type: 'date', icon: Clock },
    { name: 'birthPlace', label: 'Place of Birth', type: 'text', icon: MapPin },
    { name: 'biography', label: 'Life Story', type: 'textarea', icon: BookOpen },
    { name: 'photos', label: 'Photos', type: 'file', icon: Camera, multiple: true }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/20 to-gray-50/20">
      <TopNav />
      
      {/* Hero Section - FURTHER REDUCED PADDING */}
      <section id="what-we-offer" className="relative overflow-hidden bg-gradient-to-br from-orange-600/90 via-orange-500/90 to-amber-600/90 text-white py-10 sm:py-14 lg:py-16">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        ></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full mb-3">
              <Crown className="w-4 h-4 fill-white" />
              <span className="text-sm font-semibold">Completely Free</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 leading-tight">
              Create Beautiful Memorials
            </h1>
            
            <p className="text-lg text-white/90 mb-4 leading-relaxed">
              Honor your loved ones with beautifully designed digital memorials and printable PDF tributes - completely free.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button 
                onClick={handleGetStarted}
                className="px-5 py-2.5 bg-white text-orange-600 rounded-xl font-bold text-base hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
              >
                Create Free Memorial
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold text-base hover:bg-white/20 transition-all duration-300 border-2 border-white/30 hover:border-white/50">
                View Examples
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              How It Works
            </h2>
            <p className="text-base text-gray-600">
              Create a beautiful memorial in 4 simple steps - completely free
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-10">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="text-center">
                  <div className={`w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center ${
                    activeStep >= step.step 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className={`text-xs font-semibold mb-1 ${
                    activeStep >= step.step ? 'text-orange-600' : 'text-gray-400'
                  }`}>
                    Step {step.step}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm">{step.title}</h3>
                  <p className="text-xs text-gray-600">{step.description}</p>
                </div>
              );
            })}
          </div>

          {/* Memorial Form Preview */}
          <div className="max-w-4xl mx-auto bg-gray-50 rounded-2xl p-5 border-2 border-orange-200">
            <div className="text-center mb-5">
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full mb-3">
                <Crown className="w-3 h-3 fill-orange-600" />
                <span className="text-xs font-semibold">Free Memorial Creation</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Create Your Memorial
              </h3>
              <p className="text-sm text-gray-600">
                Register to access our complete memorial creation tools
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-5 opacity-75">
              {memorialFormFields.slice(0, 4).map((field) => {
                const Icon = field.icon;
                return (
                  <div key={field.name} className={
                    field.type === 'textarea' ? 'md:col-span-2' : ''
                  }>
                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-1">
                      <Icon className="w-3 h-3" />
                      {field.label}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        disabled
                        className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-sm"
                        placeholder="Register to unlock this feature..."
                      />
                    ) : field.type === 'file' ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-100">
                        <Camera className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-600">Register to upload photos</p>
                      </div>
                    ) : (
                      <input
                        disabled
                        type={field.type}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-sm"
                        placeholder="Register to unlock this feature..."
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center mt-5">
              <button 
                onClick={handleGetStarted}
                className="px-5 py-2.5 bg-orange-600 text-white rounded-lg font-bold text-base hover:bg-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                Register to Create Free Memorial
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-12 bg-gradient-to-b from-orange-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Our Services
            </h2>
            <p className="text-base text-gray-600">
              Everything you need to create a meaningful tribute - completely free
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-5 shadow-md border-2 border-gray-100 hover:border-orange-200 transition-all duration-300">
                  <div className="w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-orange-500" />
                        <span className="text-xs text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Simple & Free Section */}
      <section id="simple-free" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Simple & Free
            </h2>
            <p className="text-base text-gray-600">
              Create memorials completely free. We believe in making memorial creation accessible to everyone.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="relative rounded-xl p-5 bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-orange-500 text-white px-3 py-0.5 rounded-full text-xs font-semibold">
                  Available Now
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-1">Free Memorial</h3>
              <div className="mb-3">
                <span className="text-3xl font-bold text-gray-900">
                  Free
                </span>
                <span className="text-gray-600 text-sm"> memorial</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">All memorial templates are completely free</p>
              <p className="text-xs text-orange-600 font-semibold mb-4">
                Perfect for honoring your loved one
              </p>
              
              <ul className="space-y-2 mb-4">
                {[
                  "All memorials are free",
                  "Digital memorial page",
                  "Unlimited photos",
                  "Multiple templates",
                  "Family collaboration",
                  "Lifetime access"
                ].map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={handleGetStarted}
                className="w-full py-2.5 bg-orange-600 text-white rounded-lg font-bold text-base hover:bg-orange-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Crown className="w-10 h-10 mx-auto mb-3 fill-orange-500" />
          <h2 className="text-xl sm:text-2xl font-bold mb-3">
            Ready to Create Your Free Memorial?
          </h2>
          <p className="text-base text-white/90 mb-4 leading-relaxed">
            Get started today with our completely free memorial creation tools. 
            No payment required. Beautiful PDF downloads, family collaboration, and lifetime access.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button 
              onClick={handleGetStarted}
              className="px-5 py-2.5 bg-orange-500 text-white rounded-lg font-bold text-base hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              Create Free Memorial
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-lg font-bold text-base hover:bg-white/20 transition-all duration-300 border-2 border-white/30 hover:border-white/50">
              Contact Support
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WhatWeOffer;